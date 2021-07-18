import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";

const Styles = styled.div`
  padding: 1rem;
  height: 90vh;
  overflow-y: auto;
  .outline {
    border-radius: 12px;
    display: inline-block;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
  }
  table {
    border-spacing: 0;
    border-collapse: collapse;

    thead {
      color: #4a5568;
      background-color: #f7fafc;
      tr {
        color: #1a202c;
        th {
          font-size: 0.9rem;
          text-transform: uppercase;
          border-bottom: 2px solid #edf2f7;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          font-weight: 600;
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid #edf2f7;
        td {
          padding-left: 1.25rem;
          padding-right: 1.25rem;
          padding-top: 1rem;
          font-size: 0.875rem;
          padding-bottom: 1rem;
        }
      }
    }
  }
`;

const Table = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data
    });

  return (
    <Styles>
      <div className="outline">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Styles>
  );
};

export default Table;
