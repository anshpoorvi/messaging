const excel = require('node-excel-export');
 
// You can define styles as json object
const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 12,
      bold: false,
      
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  },
  
};
 
//Array of objects representing heading rows (very top)
const heading = [];

 
//Here you specify the export structure
const specification = {
  userName: { // <- the key should match the actual data key
    displayName: 'User Name', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    width: 150 // <- width in pixels
  },
  email: {
    displayName: 'Email',
    headerStyle: styles.headerDark,
    width: 200 // <- width in chars (when the number is passed as string)
  },
  totalMessages: {
    displayName: 'Total Messages',
    headerStyle: styles.headerDark,
    //cellStyle: styles.cellPink, // <- Cell style
    width: 100 // <- width in pixels
  },
  sendMessages: {
    displayName: 'Send Messages',
    headerStyle: styles.headerDark,
    //cellStyle: styles.cellPink, // <- Cell style
    width: 100 // <- width in pixels
  },
  status: {
    displayName: 'Send Messages',
    headerStyle: styles.headerDark,
  //  cellStyle: styles.cellPink, // <- Cell style
    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
        return (value == 1) ? 'Active' : 'Inactive';
      },
    width: 100 // <- width in pixels
  }
}
 

// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
const merges = [
  { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
  { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
  { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
]
 
// Create the excel report.
// This function will return Buffer

// You can then return this straight

 
// OR you can save this buffer to the disk by creating a file.
var createExcel =(res, reportData)=>{
    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
          {
            name: 'Report', // <- Specify sheet name (optional)
            heading: heading, // <- Raw heading array (optional)
            specification: specification, // <- Report specification
            data: reportData // <-- Report data
          }
        ]
      );
       
    res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
}
module.exports = {
    createExcel
};