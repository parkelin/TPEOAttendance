import React from 'react';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import {FormControl} from 'react-bootstrap'
import moment from "moment"

export default class DateTime extends React.Component {

    constructor(props){
        super(props);
        let now = new Date();
        let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0));
        let end = moment(start).add(1, "days").subtract(1, "seconds");
        this.state = {
            start : start,
            end : end
        }

        this.applyCallback = this.applyCallback.bind(this);
    }

    applyCallback(startDate, endDate){
        console.log(startDate);
        this.setState({
                start: startDate,
                end : endDate
            }
        )
    }

    render(){
            let now = new Date();
            let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0));
            let end = moment(start).add(1, "days").subtract(1, "seconds");
            let ranges = {
                "Today Only": [moment(start), moment(end)],
                "Yesterday Only": [moment(start).subtract(1, "days"), moment(end).subtract(1, "days")],
                "3 Days": [moment(start).subtract(3, "days"), moment(end)]
            }
            let local = {
                "format":"MM-DD-YYYY HH:mm",
                "sundayFirst" : true
            }
            let maxDate = moment(start).add(1, "year")
            return(
                <div>
                    <DateTimeRangeContainer 
                        ranges={ranges}
                        start={this.state.start}
                        end={this.state.end}
                        local={local}
                        maxDate={maxDate}
                        applyCallback={this.applyCallback}


                    >    
                        <FormControl
                        id="formControlsTextB"
                        type="text"
                        label="Text"
                        placeholder="Meeting time"
                        /> 
                    </DateTimeRangeContainer>
                </div>
            );
        }
}