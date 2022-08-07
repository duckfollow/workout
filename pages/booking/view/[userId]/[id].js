import Head from 'next/head'
import axios from 'axios'
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Resources,
    WeekView,
    MonthView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    EditRecurrenceMenu,
    // DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const ExternalViewSwitcher = ({
    currentViewName,
    onChange,
}) => (
    <RadioGroup
        aria-label="Views"
        style={{ flexDirection: 'row' }}
        name="views"
        value={currentViewName}
        onChange={onChange}
    >
        <FormControlLabel value="Week" control={<Radio />} label="Week" />
        <FormControlLabel value="Work Week" control={<Radio />} label="Work Week" />
        <FormControlLabel value="Month" control={<Radio />} label="Month" />
    </RadioGroup>
);


export default function View({ data, userId, current_date, id, data_room }) {
    const [currentViewName, setCurrentViewName] = useState('Month');
    const dataSchedule = data.data.map(item => {
        return {
            id: item.id,
            startDate: new Date(item.start_date),
            endDate: new Date(item.end_date),
            title: `Room ${item.roomId}:${item.id} ${item.title}`,
            roomId: item.roomId,
        }
    })
    const [schedulerData, setSchedulerData] = useState(dataSchedule)
    const [currentDate, setCurrentDate] = useState(current_date)
    const [listRoom, setListRoom] = useState([Number(id)])

    const currentViewNameChange = (event) => {
        console.log(event.target.value)
        setCurrentViewName(event.target.value);
    }

    const handleChange = (value) => {
        console.log(value)
        var currentDate = new Date(value)
        console.log(listRoom)

        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking/read`, {
            "store": userId,
            "current_date": currentDate,
            "roomId": listRoom,
        }).then(res => {
            // console.log(res.data)
            setSchedulerData(res.data.data.map(item => {
                return {
                    id: item.id,
                    startDate: new Date(item.start_date),
                    endDate: new Date(item.end_date),
                    title: `Room ${item.roomId}:${item.id} ${item.title}`,
                    roomId: item.roomId,
                }
            }))
            setCurrentDate(currentDate);
        })
    }

    const commitChanges = ({ added, changed, deleted }) => {

    }

    const selectRoom = (id) => {
        if (listRoom.length === 3) {
            listRoom.shift()
        }
        listRoom.push(id)
        handleChange(currentDate)
    }

    const colors = ['#5DADE2', '#9B59B6', '#CD6155', '#F1C40F', '#95A5A6']
    const resourcesData = listRoom.map((item, index) => {
        return {
            text: `${item}`,
            id: item,
            color: colors[index],
        }
    })

    const resources = [
        {
            fieldName: 'roomId',
            title: 'Room',
            instances: resourcesData,
        }
    ]


    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }
        }>
            <Head>
                <title>Scheduler</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <ExternalViewSwitcher
                currentViewName={currentViewName}
                onChange={currentViewNameChange}
            /> */}
            <div style={
                {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'left',
                    alignItems: 'left',
                    width: '100%',
                }
            }>
                {
                    data_room.data.map(item => {
                        return <div key={item.id} style={
                            {
                                padding: '10px',
                                border: '1px solid',
                                borderColor: listRoom.includes(item.id) ? '#5DADE2' : '#ccc',
                                borderRadius: '5px',
                                margin: '5px',
                                cursor: 'pointer',
                            }
                        } onClick={() => {
                            selectRoom(item.id)
                        }
                        }>Room {item.id}</div>
                    })
                }

            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    // label="For desktop"
                    value={currentDate}
                    minDate={new Date('2017-01-01')}
                    onChange={(newValue) => {
                        console.log(newValue)
                        handleChange(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
                <Paper>
                    <Scheduler
                        data={schedulerData}
                        height='100%'
                    >
                        <ViewState
                            currentDate={currentDate}
                            defaultCurrentDate={currentDate}
                            currentViewName={currentViewName}
                        />
                        {/* <EditingState
                        onCommitChanges={commitChanges}
                    />
                    <EditRecurrenceMenu /> */}
                        <WeekView
                            startDayHour={0}
                            endDayHour={24}
                        />
                        <WeekView
                            name="Work Week"
                            excludedDays={[0, 6]}
                            startDayHour={0}
                            endDayHour={24}
                        />
                        <MonthView />

                        <Appointments />
                        <AppointmentTooltip />
                        <Resources
                            data={resources}
                            mainResourceName="roomId"
                        />
                    </Scheduler>
                </Paper>
        </div>
    )
}

export async function getServerSideProps(context) {
    const userId = context.query.userId
    const id = context.query.id
    const current_date = (new Date()).toISOString().split('T')[0]
    console.log(current_date)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking/read`, {
        "store": userId,
        "current_date": current_date,
        "roomId": [id],
    })
    const data = await res.data
    const res_room = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/read`, {
        "store": userId
    })
    const data_room = await res_room.data
    return {
        props: {
            data,
            userId,
            current_date,
            id,
            data_room
        }
    }
}