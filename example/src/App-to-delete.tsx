import useList from 'use-list';

interface Person {
  id: number;
  name: string;
  age: number;
}

function App() {
  const data: Person[] = [
    { id: 1, name: 'Alice', age: 28 },
    { id: 2, name: 'Bob', age: 32 },
    { id: 3, name: 'Charlie', age: 25 }
  ];

  const { items, columns, isEmpty } = useList(data);

  if (isEmpty) return <div>No items to display</div>;

  return (
    <table border="1">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col}>{(item as any)[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;