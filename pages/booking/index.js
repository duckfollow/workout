import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Profile.module.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import TextField from '@mui/material/TextField';
import Lottie from "lottie-react";
import calendar_booking from "../../public/46690-calendar-booking.json";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { io } from 'socket.io-client';
import { IconButton } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
const { AppBar } = require('../../components')
import NoSsr from '@mui/material/NoSsr';

function Booking({ data, userId }) {
    const router = useRouter();
    const [dataTable, setDataTable] = useState(data)
    const [open, setOpen] = useState(false);
    const [idDelete, setIdDelete] = useState();
    const cookies = parseCookies()
    const [_userId, setUserId] = useState(userId);
    const [loginId, setLoginId] = useState();
    const [animateLogin, setAnimateLogin] = useState(false);
    const socket = io(process.env.NEXT_PUBLIC_URL_WEBSOCKET, { transports: ['websocket'] });
    console.log(dataTable.data.length)

    useEffect(() => {
        socket.connect();
        socket.on("message", data => {
            if (data.userId === _userId) {
                readTable();
            }
        });

        return () => {
            socket.disconnect();
        }
    }, [])

    const handlepost = () => {
        setTimeout(() => {
            socket.connect();
            socket.emit("message", { userId });
        }, 300);
    };

    const handleClickOpen = (id) => {
        setIdDelete(id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const createRoom = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/create`, {
            store: _userId != null ? _userId : process.env.NEXT_PUBLIC_USER
        }).then(res => {
            handlepost()
        })
    }

    const readTable = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/read`, {
            store: _userId != null ? _userId : process.env.NEXT_PUBLIC_USER
        }).then(res => {
            setDataTable(res.data)
        })
    }

    const deleteTable = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/table/delete`, {
            id: idDelete
        }).then(res => {
            setOpen(false);
            handlepost()
        })
    }

    const clickOrder = (order, id) => {
        router.push(`/order/${userId}/${order}/${id}`)
    }

    const clickTry = () => {
        let userId = randomString()
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/create`, {
            id: userId,
        }).then(res => {
            setUserId(userId)
            setCookie(null, 'userId', userId, { path: '/' })
            router.reload()
        })
    }

    const randomString = () => {
        return (Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4)).toUpperCase();
    }

    const clickLogin = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/readById`, {
            id: loginId
        }).then(res => {
            if (Boolean(res.data.data.isfirstLogin)) {
                router.push(`/verify/${res.data.token}`)
            } else {
                // setUserId(res.data.data.id)
                // setCookie(null, 'userId', res.data.data.id, { path: '/' })
                // router.reload()
                router.push(`/confirm/${res.data.token}`)
            }
        }).catch(err => {
            setAnimateLogin(true)
            setLoginId('')
            console.log(err)
        })
    }

    const clickLogout = () => {
        destroyCookie(null, 'userId', { path: '/' })
        router.reload()
    }

    const downloadCSV = (e) => {
        // Prevent Form submit, the form will refresh too fast and can't be sent the data to backend database if no prevent default
        e.preventDefault();
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement("a");
        //  ***Need to change "output.csv" => This is a file name can be changed
        a.download = "output.csv";
        a.href = `https://api.duckfollow.co/api/v1/booking/room/booking/report/${userId}`;
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Demo Booking</title>
                <link rel="icon" href="/logo-2.png" />
                <meta property="og:url" content="https://workout.duckfollow.co/" />
                <meta property="og:type" content="article" />
                <meta property="og:image:width" content="500" />
                <meta property="og:image:height" content="500" />
                <meta property="og:title" content="POS ออนไลน์" />
                <meta property="og:description" content="POS ออนไลน์" />
                <meta property="og:image" content="/thumbnail.png" />

                <meta name="twitter:title" content="POS ออนไลน์" />
                <meta name="twitter:description" content="POS ออนไลน์" />
                <meta name="twitter:image" content="/thumbnail.png" />
                <meta name="twitter:card" content="summary_large_image"></meta>

                <meta name="description" content="POS ออนไลน์" />
            </Head>
            <AppBar />

            <main className={styles.main}>
                <NoSsr>
                    {
                        cookies.isfirstLogin === 'true' || cookies.isfirstLogin === undefined ? <div style={
                            {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        }>
                            <h1 className={styles.title}>
                                Welcome <a>Demo Booking</a>
                            </h1>
                            <div>
                                <Image src='/booking.png' alt="" width={150} height={150} className={styles.img_profile} />
                            </div>
                        </div>
                            : null
                    }
                </NoSsr>

                {
                    _userId == process.env.NEXT_PUBLIC_USER ? <div style={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginTop: '20px'

                        }
                    }>
                        <Button variant="outlined" startIcon={<ScienceOutlinedIcon />} size="small" color="primary" onClick={clickTry}> ทดลองใช้งานฟรี</Button>
                        <p align="center"
                            style={{
                                fontSize: '14px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                            }}>
                            คลิกที่ปุ่มด้านบนเพื่อทดลองใช้งานฟรี ระบบจะสร้างรหัสผู้ใช้งานใหม่ หรือจะใช้งานในโหมด demo ได้เลย
                        </p>
                    </div>
                        : <NoSsr>
                            <span
                                style={
                                    {
                                        margin: '10px',
                                        display: cookies.isfirstLogin === 'false' ? 'none' : 'block',
                                    }
                                }>
                                รหัสผู้ใช้ทดสอบ: <strong>{userId}</strong> <Button variant="outlined" startIcon={<LogoutIcon />} size="small" color="primary" onClick={clickLogout}>ออก</Button>
                            </span>
                        </NoSsr>
                }

                <div className={styles.grid_menu}>
                    <Link href={`/booking/view/${userId}/${dataTable.data.length > 0 ? dataTable.data[0].id : 1}`} passHref >
                        <div className={styles.card_product}>
                            <Image src={'/search.png'} alt={''} width={40} height={40} />
                            <span>&nbsp;ดูการจอง</span>
                        </div>
                    </Link>
                    <div className={styles.card_notification} onClick={createRoom}>
                        <Image src={'/living-room.png'} alt={''} width={40} height={40} />
                        <span>&nbsp;เพิ่มห้อง</span>
                    </div>
                    <div className={styles.card_notification} onClick={downloadCSV}>
                        <Image src={'/statistics.png'} alt={''} width={40} height={40} />
                    </div>
                </div>

                <div className={styles.grid}>
                    {
                        dataTable.data.map((item, index) => {
                            return (
                                <div className={styles.card} key={index}>
                                    <div className={styles.view_table}>
                                        <div className={styles.text}>
                                            <span
                                                style={
                                                    {
                                                        fontSize: '20px',
                                                    }
                                                }>ห้อง</span>
                                            <span
                                                style={{
                                                    fontSize: '40px',
                                                }}>{item.name ? item.name : index + 1}</span>
                                            <span
                                                style={
                                                    {
                                                        fontSize: '12px',
                                                    }
                                                }>
                                                (id: {item.id})
                                            </span>
                                        </div>
                                        <div className={styles.table}>
                                            <Image src={`/bed.png`} alt={''} width={100} height={100} objectFit='contain' />
                                            <div>
                                                <Button variant="outlined" startIcon={<EventAvailableIcon />} color={'primary'} onClick={() => {
                                                    // clickOrder(index + 1, item.id)
                                                    router.push(`/booking/room/${item.id}`)
                                                }}>จอง</Button> {' '}
                                                <IconButton size="large" onClick={
                                                    () => {
                                                        router.push(`/booking/room/setting/${item.id}`)
                                                    }
                                                }>
                                                    <TuneIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </main>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"คุณต้องการจะลบใช่หรือไม่?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        คุณจะไม่สามารถกู้คืนรายการนี้ได้ id:{idDelete} หากคุณลบรายการนี้
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>ยกเลิก</Button>
                    <Button onClick={deleteTable}>ลบ</Button>
                </DialogActions>
            </Dialog>
            <hr />

            {_userId == process.env.NEXT_PUBLIC_USER ?
                <div className={styles.view_show_sale}>
                    <div>
                        <p align='center' style={
                            {
                                fontSize: '50px',
                                fontWeight: 'bold',
                            }
                        }>
                            ทำไมต้องใช้เรา?
                        </p>
                        <div>
                            <div className={styles.grid}>
                                <div className={styles.card} style={
                                    {
                                        minHeight: '190px',
                                    }
                                }>
                                    <Image src={'/profits.png'} alt={''} width={40} height={40} />
                                    <h3 style={
                                        {
                                            marginBottom: '5px',
                                            marginTop: '5px',
                                        }
                                    }>1. เพิ่มยอดขายให้กับร้านค้า</h3>
                                    <p style={
                                        {
                                            marginTop: '0px',
                                        }
                                    }>
                                        ระบบรายงานยอดขายประจำวัน เพื่อให้ร้านค้าสามารถตรวจสอบยอดขายประจำวันได้อย่างรวดเร็ว
                                    </p>
                                </div>
                                <div className={styles.card} style={
                                    {
                                        minHeight: '190px',
                                    }
                                }>
                                    <Image src={'/paper.png'} alt={''} width={40} height={40} />
                                    <h3 style={
                                        {
                                            marginBottom: '5px',
                                            marginTop: '5px',
                                        }
                                    }>2. ช่วยลดการใช้กระดาษ</h3>
                                    <p style={
                                        {
                                            marginTop: '0px',
                                        }
                                    }>
                                        ลดการใช้กระดาษ ลดต้นทุน ลดค่าใช้จ่าย ช่วยโลกลดโลกร้อน
                                    </p>
                                </div>
                                <div className={styles.card} style={
                                    {
                                        minHeight: '190px',
                                    }
                                }>
                                    <Image src={'/easy.png'} alt={''} width={40} height={40} />
                                    <h3 style={
                                        {
                                            marginBottom: '5px',
                                            marginTop: '5px',
                                        }
                                    }>3. สะดวก ใช้งานง่าย ทดลองใช้ฟรี</h3>
                                    <p style={
                                        {
                                            marginTop: '0px',
                                        }
                                    }>
                                        สามารถทดลองใช้งานได้ไม่มีกำหนดเวลา ทดลองใช้งานฟรี
                                    </p>

                                </div>
                                <div className={styles.card} style={
                                    {
                                        minHeight: '190px',
                                    }
                                }>
                                    <Image src={'/tv-show.png'} alt={''} width={40} height={40} />
                                    <h3 style={
                                        {
                                            marginBottom: '5px',
                                            marginTop: '5px',
                                        }
                                    }>4. พัฒนาฟีเจอร์ใหม่ๆ</h3>
                                    <p style={
                                        {
                                            marginTop: '0px',
                                        }
                                    }>
                                        มีฟีเจอร์ใหม่ๆ ให้ทดลองใช้งาน ลองเล่นตลอดเวลา
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={
                        {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            padding: '10px',
                            marginBottom: '50px',
                        }
                    }>
                        <div className={styles.main} style={
                            {
                                marginBottom: '10px',
                                border: '1px solid #e0e0e0',
                                padding: '20px',
                                borderRadius: '5px',
                                marginLeft: '3px',
                                marginRight: '3px',
                                minHeight: '485px',
                            }
                        }>
                            <p
                                style={
                                    {
                                        marginTop: '0px',
                                        marginBottom: '0px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }
                                }>
                                ยินดีต้อนรับกลับมาใช้งานใหม่อีกครั้ง
                            </p>
                            <Lottie id='lottie' style={
                                {
                                    width: '260px',
                                    height: '260px',
                                }
                            } animationData={calendar_booking} loop={true} />
                            <TextField
                                placeholder='ใส่รหัสผู้ใช้งานเดิมของคุณ'
                                size='small'
                                value={loginId}
                                fullWidth
                                className={animateLogin ? styles.input_login : ""}
                                onAnimationEnd={() => {
                                    setAnimateLogin(false)
                                }}
                                onChange={
                                    (e) => {
                                        setLoginId(e.target.value)
                                    }
                                } />
                            <br />
                            <Button fullWidth variant="outlined" startIcon={<LoginIcon />} size="medium" color="primary" onClick={clickLogin}>เข้าใช้งานอีกครั้ง</Button>
                        </div>
                        <div className={styles.main} style={
                            {
                                marginBottom: '10px',
                                border: '1px solid #e0e0e0',
                                padding: '20px',
                                borderRadius: '5px',
                                marginLeft: '3px',
                                marginRight: '3px',
                                minHeight: '485px',
                            }
                        }>
                            <p
                                style={
                                    {
                                        marginTop: '0px',
                                        marginBottom: '0px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }
                                }>
                                แพ็กเกจ
                            </p>
                            <div style={
                                {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                }
                            }>
                                <div style={
                                    {
                                        padding: '10px',
                                    }
                                }>
                                    <p align='center' style={
                                        {
                                            color: '#0073cd',
                                            fontSize: '35px',
                                            fontWeight: 'bold',
                                            marginBottom: '0px',
                                            marginTop: '0px',
                                        }
                                    }>
                                        Starter
                                    </p>
                                    <p align='center' style={{
                                        fontSize: '30px',
                                        marginBottom: '0px',
                                        marginTop: '0px',
                                        color: '#ff5f5a',
                                    }}>
                                        ฟรี
                                    </p>
                                    <p>
                                        <strong>ฟีเจอร์หลัก:</strong><br />
                                        ✔️ เช็คห้องว่างออนไลน์<br />
                                        ✔️ บันทึกการจองห้องพัก<br />
                                        ✔️ ออกรายงานการจอง<br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    )
}

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
    console.log(userId)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/read`, {
        "store": userId
    })
    const data = await res.data
    return {
        props: {
            data,
            userId
        }
    }
}

export default Booking
