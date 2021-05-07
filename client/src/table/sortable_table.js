import React from 'react';
import ReactDropdown from 'react-dropdown';

// used in getRowsData, create cells for each row
const RenderRow = (props) =>{
  return props.keys.map((key, index)=>{
    return <td>{props.data[key]}</td>
  })
}

export default class Sortable_Table extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        data: props.data,
        xAttribute: props.xAttribute,
        yAttribute: props.yAttribute,
        asc_lst: Array(Object.keys(props.data[0]).length).fill(1)
      };
      this.getHeader = this.getHeader.bind(this);
      this.getRowsData = this.getRowsData.bind(this);
      this.getKeys = this.getKeys.bind(this);
      this.onClick = this.onClick.bind(this);
    }

    // change the state whenever the xAttribute or yAttribute changes
    static getDerivedStateFromProps(props, state) {
      if (state.xAttribute !== props.xAttribute || state.yAttribute !== props.yAttribute) {
        return {
          data: props.data,
          xAttribute: props.xAttribute,
          yAttribute: props.yAttribute,
          asc_lst: Array(Object.keys(props.data[0]).length).fill(1)
        }
      }
      return null
    }


    getKeys() {
      return Object.keys(this.state.data[0]);
    }

    // create the header
    getHeader() {
      var keys = this.getKeys();
      return keys.map((key, index)=>{
        return <th id={index}>{key}</th>
      })
    }

    // create each row
    getRowsData() {
      var items = this.props.data;
      var keys = this.getKeys();
      return items.map((row, index)=>{
        return <tr><RenderRow data={row} keys={keys}/></tr>
      })
    }

    // header on click sort
    onClick(event) {
      const col = event.target.textContent // column name
      const col_num = event.target.id // column number
      const asc_lst = this.state.asc_lst  // the list keeping track of the order of each column
      const asc = asc_lst[col_num] // the order of the current column
      let newdata = this.state.data // dataset
      // sort data baseed on column and order
      newdata.sort(function(a, b){
        return (parseFloat(a[col].replace(/,/g, '')) == parseFloat(b[col].replace(/,/g, '')))
                  ? 0 : (( parseFloat(a[col].replace(/,/g, '')) > parseFloat(b[col].replace(/,/g, '')))
                  ? asc : -1*asc
                );
      });
      // update dataset state
      this.setState({data:newdata, asc});
      // update order state
      // in order to modify the order list, write to the copied list and then write the list back
      asc_lst[col_num] = -1*asc_lst[col_num] //
      this.setState({
        asc_lst: asc_lst
      });
    }

    render() {
        return (
          <div>
            <table>
            <thead onClick={this.onClick}>
              <tr>{this.getHeader()}</tr>
            </thead>
            <tbody>
              {this.getRowsData()}
            </tbody>
            </table>
          </div>

        );
    }
}
