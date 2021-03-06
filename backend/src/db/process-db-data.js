
import {TableColumn} from '../classes/table-column.js';
import {Table} from '../classes/table.js';
import {DATABASE_TYPES} from './db-types.js';

const TABLE_NAME = 'table_name';
const COLUMN_NAME = 'column_name';
const DATA_TYPE = 'data_type';
const COLUMN_KEY = 'column_key';

const [MYSQL] = DATABASE_TYPES;

function getTypeName(type) {
  return type.includes('(') ? type.substring(0, type.indexOf('(')) : type;
}

export function processTableNames(dbType, dbResults) {
  return dbResults.reduce((acc, result) => {
    acc.push(new Table(result[TABLE_NAME]));
    return acc;
  }, []);
}

export function processTableColumns(dbType, dbResults) {
  return dbResults.reduce((acc, result) => {
    acc.push(new TableColumn({
      columnName: result[COLUMN_NAME],
      columnKey: dbType === MYSQL && result[COLUMN_KEY],
      dataType: getTypeName(result[DATA_TYPE])
    }));
    return acc;
  }, []);
}

export function processTablesAndColumns(dbType, dbResults) {
   const tablesMap = dbResults.reduce((map, result) => {
    if (map.has(result[TABLE_NAME])) {
      map.get(result[TABLE_NAME]).push({
        columnName: result[COLUMN_NAME],
        dataType: getTypeName(result[DATA_TYPE]),
        columnKey: dbType === MYSQL && result[COLUMN_KEY],
      });
    } else {
      map.set(result[TABLE_NAME], [{
        columnName: result[COLUMN_NAME],
        dataType: getTypeName(result[DATA_TYPE]),
        columnKey: dbType === MYSQL && result[COLUMN_KEY],
      }]);
    }
    return map;
  }, new Map());

  const tables = [];
  tablesMap.forEach((value, key) => {
    const table = new Table(key);
    table.columns = value.reduce((acc, column) => {
      acc.push(new TableColumn(column));
      return acc;
    }, []);
    tables.push(table);
  });

  return tables;
}
