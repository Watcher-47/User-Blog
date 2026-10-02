export default function ShowcaseTable({ columns, rows }) {
    return (
        <div className="table-wrap">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={row._id || row.id || rowIndex}>
                            {row.cells.map((cell, index) => (
                                <td key={`${row._id || row.id || rowIndex}-${index}`} className={index === 0 ? 'primary-cell' : ''}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}