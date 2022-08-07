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
import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';

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


export default function View({ data, userId, current_date, id }) {
    const [currentViewName, setCurrentViewName] = useState('Month');
    const dataSchedule = data.data.map(item => {
        return {
            id: item.id,
            startDate: new Date(item.start_date),
            endDate: new Date(item.end_date),
            title: `${item.title} ${item.firstname} ${item.lastname} ${item.phone} ${item.email} room ${item.roomId}`,
            roomId: item.roomId,
        }
    })
    const [schedulerData, setSchedulerData] = useState(dataSchedule)
    const [currentDate, setCurrentDate] = useState(current_date)
    const [checkIn, setCheckIn] = useState(current_date)
    const [checkOut, setCheckOut] = useState(current_date);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');

    const currentViewNameChange = (event) => {
        console.log(event.target.value)
        setCurrentViewName(event.target.value);
    }

    const handleChange = (value) => {
        let _currentDate = new Date(value)
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking/read`, {
            "store": userId,
            "current_date": _currentDate,
            "roomId": [id],
        }).then(res => {
            // console.log(res.data)
            let data = res.data.data.map(item => {
                return {
                    id: item.id,
                    startDate: new Date(item.start_date),
                    endDate: new Date(item.end_date),
                    title: `${item.title} ${item.firstname} ${item.lastname} ${item.phone} ${item.email} room ${item.roomId}`,
                    roomId: item.roomId,
                }
            })
            data.push({
                id: checkOut,
                startDate: new Date(checkIn),
                endDate: new Date(checkOut),
                title: `Booking Now`,
                roomId: id + 1,
            })
            setSchedulerData(data)
            setCurrentDate(_currentDate);
        })
    }

    const handleCheckIn = (value) => {
        setCheckIn(value);
        setCheckOut(value);
    }

    const handleCheckOut = (value) => {
        let checkOut = value;
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking/read`, {
            "store": userId,
            "current_date": currentDate,
            "roomId": [id],
        }).then(res => {
            // console.log(res.data)
            let data = res.data.data.map(item => {
                return {
                    id: item.id,
                    startDate: new Date(item.start_date),
                    endDate: new Date(item.end_date),
                    title: `${item.title} ${item.firstname} ${item.lastname} ${item.phone} ${item.email} room ${item.roomId}`,
                    roomId: item.roomId,
                }
            })
            data.push({
                id: checkOut,
                startDate: new Date(checkIn),
                endDate: new Date(checkOut),
                title: `Booking Now`,
                roomId: id + 1,
            })
            setSchedulerData(data)
            setCheckOut(checkOut);
        })
    }

    const commitChanges = ({ added, changed, deleted }) => {

    }

    const resourcesData = [
        {
            text: 'Room 101',
            id: id,
            color: '#5DADE2',
        }, {
            text: 'Room 102',
            id: id + 1,
            color: '#16A085',
        }
    ];

    const resources = [
        {
            fieldName: 'roomId',
            title: 'Room',
            instances: resourcesData,
        }
    ]

    // click left button to change date
    const handleLeftButton = () => {
        console.log('left', currentDate)
        let _currentDate = new Date(currentDate);
        _currentDate.setMonth(_currentDate.getMonth() - 1);
        console.log(_currentDate)
        handleChange(_currentDate);
    }

    const handleRightButton = () => {
        console.log('right', currentDate)
        let _currentDate = new Date(currentDate);
        _currentDate.setMonth(_currentDate.getMonth() + 1);
        console.log(_currentDate)
        handleChange(_currentDate);
    }

    const readBooking = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking/read`, {
            "store": userId,
            "current_date": currentDate,
            "roomId": [id],
        }).then(res => {
            // console.log(res.data)
            let data = res.data.data.map(item => {
                return {
                    id: item.id,
                    startDate: new Date(item.start_date),
                    endDate: new Date(item.end_date),
                    title: `${item.title} ${item.firstname} ${item.lastname} ${item.phone} ${item.email} room ${item.roomId}`,
                    roomId: item.roomId,
                }
            })
            setSchedulerData(data)
        })
    }

    // click button to booking room
    const handleBooking = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking`, {
            "store": userId,
            "roomId": Number(id),
            "firstname": firstname,
            "lastname": lastname,
            "phone": phone,
            "email": email,
            "title": title,
            "start_date": new Date(checkIn),
            "end_date": new Date(checkOut),
        }).then(res => {
            console.log(res.data)
            readBooking()
            setFirstname('');
            setLastname('');
            setPhone('');
            setEmail('');
            setTitle('');
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50px',
                marginBottom: '50px',
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={2} style={
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                }>
                    <DesktopDatePicker
                        label="Check-in"
                        value={checkIn}
                        minDate={new Date('2017-01-01')}
                        onChange={(newValue) => {
                            handleCheckIn(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <DesktopDatePicker
                        label="Check-out"
                        value={checkOut}
                        minDate={new Date('2017-01-01')}
                        onChange={(newValue) => {
                            handleCheckOut(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />

                </Stack>

            </LocalizationProvider>

            <Paper style={
                {
                    margin: '20px',
                }
            }>
                <Stack direction="row" style={
                    {
                        display: 'flex',
                        justifyContent: 'right',
                        alignItems: 'center',
                    }
                }>
                    <IconButton aria-label="delete" size="large" onClick={handleLeftButton}>
                        <ChevronLeftIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="delete" size="large" onClick={handleRightButton}>
                        <ChevronRightIcon fontSize="inherit" />
                    </IconButton>
                </Stack>
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
            <Paper style={
                {
                    padding: '20px',
                }
            }>
                <h1>ข้อมูลการจอง</h1>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="ชื่อ" variant="outlined" value={firstname} onChange={
                        (e) => {
                            setFirstname(e.target.value)
                        }
                    } />
                    <TextField id="outlined-basic" label="นามสกุล" variant="outlined" value={lastname} onChange={
                        (e) => {
                            setLastname(e.target.value)
                        }
                    } />
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="เบอร์โทร" variant="outlined" value={phone} onChange={
                        (e) => {
                            setPhone(e.target.value)
                        }
                    } />
                    <TextField id="outlined-basic" label="อีเมล" variant="outlined" value={email} onChange={
                        (e) => {
                            setEmail(e.target.value)
                        }
                    }/>
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="note" variant="outlined" value={title} onChange={
                        (e) => {
                            setTitle(e.target.value)
                        }
                    } />
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                >
                    <Button variant="contained" color="primary" onClick={handleBooking}>
                        บันทึก
                    </Button>
                </Box>
            </Paper>
        </div>
    )
}

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
    const id = context.query.id
    const current_date = (new Date()).toISOString().split('T')[0]
    console.log(current_date)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/booking/read`, {
        "store": userId,
        "current_date": current_date,
        "roomId": [id],
    })
    const data = await res.data
    console.log(data)
    return {
        props: {
            data,
            userId,
            current_date,
            id
        }
    }
}