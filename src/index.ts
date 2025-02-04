import { useCallback, useEffect, useState } from 'react'

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

type UseListOptions = {
    selectedProp?: string
    matchedProp?: string
}
interface UseListResult<T extends object> {
    list: T[]
    addItems: (items: T[], atEnd?: boolean) => void
    addItem: (item: T, index?: number) => void
    updateItem: (changes: object, index: number) => void
    updateItems: (changes: object, indices: number[]) => void
    deleteItem: (index: number) => void
    deleteItems: (indices: number[]) => void
    filterItems: (property: string, query: string) => void
    clearFilters: () => void
    setList: (list: T[]) => void
    sortItems: (property: string | null, ascending: boolean) => void
    toggleSelectItem: (index: number, doSelect?: boolean) => void
    toggleSelectAllItems: (doSelect?: boolean) => void
}

const defaultOptions: UseListOptions = {
    selectedProp: 'isSelected',
    matchedProp: 'isMatched',
}

export function useList<T extends object>(inputList: T[] = [], options: UseListOptions = defaultOptions): UseListResult<T> {
    const [listData, setListData] = useState<any[]>([])

    options = { ...defaultOptions, ...options }

    useEffect(() => {
        if (inputList) {
            setList(inputList)
        }
    }, [])

    const setList = useCallback(
        (list: any[]) => {
            const updatedList: any[] = [...list]
                .filter((item: any) => item !== null)
                .map((item: any) => {
                    if (item) {
                        const selectedProp = (options && options.selectedProp) || 'isSelected'
                        const matchedProp = (options && options.matchedProp) || 'isMatched'
                        item[selectedProp] = !!item[selectedProp]
                        // item[matchedProp] = !!item[matchedProp]
                        item[matchedProp] = true
                        return item
                    }
                })
            setListData(updatedList)
        },
        [options],
    )

    const addItem = (item: any = {}, index: number = 0) => {
        const updatedList = clone(listData)
        if (item) updatedList.splice(index, 0, clone(item))
        setList(updatedList)
    }

    const addItems = (items: any[] = [], atEnd: boolean = true) => {
        if (items && items.length) {
            setList(atEnd ? [...clone(listData), ...items] : [...items, ...clone(listData)])
        }
    }

    const updateItem = (changes: any = {}, index: number) => {
        const updatedList = clone(listData)
        updatedList[index] = { ...updatedList[index], ...changes }
        setListData(updatedList)
    }

    const updateItems = (changes: any = {}, indices: number[] = []) => {
        if (indices && indices.length) {
            setListData(clone(listData).map((item: any, itemIndex: number) => (indices.includes(itemIndex) ? { ...item, ...changes } : item)))
        }
    }

    const deleteItem = (index: number | null = null) => {
        const updatedList = clone(listData)

        updatedList.splice(index, 1)
        setListData(updatedList)
    }

    const deleteItems = (indices: number[] = []) => {
        const updatedList = clone(listData).filter((item: any, itemIndex: number) => !indices.includes(itemIndex))
        setListData(updatedList)
    }

    const filterItems = (property: any = null, query: string) => {
        if (property == null || typeof property !== 'string' || !options) {
            return
        }
        const updatedList = clone(listData)
        updatedList
            .filter((item: any) => item !== null)
            .forEach((item: any) => {
                if (item[property]) {
                    const x = typeof item[property] === 'string' ? item[property].toLowerCase() : item[property].toString()
                    const q = typeof item[property] === 'string' ? query.toLowerCase() : query
                    if (options.matchedProp) item[options.matchedProp] = x.includes(q)
                    return item
                } else {
                    if (options.matchedProp) item[options.matchedProp] = false
                }
            })
        setListData(updatedList)
    }

    const clearFilters = () => {
        const updatedList = clone(listData)
        updatedList.forEach((item: any) => {
            if (options.matchedProp) item[options.matchedProp] = false
        })
        setListData(updatedList)
    }

    const sortItems = (property: string | null, ascending: boolean = true) => {
        if (property == null || typeof property !== 'string') {
            return
        }
        const updatedList = clone(listData)
        updatedList.sort(function (currentItem: any, nextItem: any) {
            const value = currentItem ? (typeof currentItem[property] === 'string' ? currentItem[property].toLowerCase() : currentItem[property]) : null
            const nextValue = nextItem ? (typeof nextItem[property] === 'string' ? nextItem[property].toLowerCase() : nextItem[property]) : null
            const returnValue = ascending ? -1 : 1
            return value < nextValue ? returnValue : value > nextValue ? -returnValue : 0
        })
        setListData(updatedList)
    }

    const toggleSelectAllItems = (doSelect = false) => {
        if (!options) return
        const updatedList = clone(listData).map((item: any) => {
            if (options.selectedProp) item[options.selectedProp] = doSelect
            return item
        })
        setListData(updatedList)
    }

    const toggleSelectItem = (index = 0, doSelect = false) => {
        if (!(options && listData[index])) return
        const updatedList = clone(listData)
        if (index != null && options.selectedProp) updatedList[index][options.selectedProp] = doSelect
        setListData(updatedList)
    }

    return {
        list: listData,
        addItem,
        addItems,
        updateItem,
        updateItems,
        clearFilters,
        deleteItem,
        deleteItems,
        filterItems,
        setList,
        sortItems,
        toggleSelectItem,
        toggleSelectAllItems,
    }
}
