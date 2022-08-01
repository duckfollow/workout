import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Profile.module.css'
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
import preparing_food from "../public/95592-preparing-food.json";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

function Profile({ data, userId }) {
  const router = useRouter();
  const [dataTable, setDataTable] = useState(data)
  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState();
  // const cookies = parseCookies()
  const [_userId, setUserId] = useState(userId);
  const [loginId, setLoginId] = useState();
  const [animateLogin, setAnimateLogin] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      readTable();
    }, 1500)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handleClickOpen = (id) => {
    setIdDelete(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const createTable = () => {
    axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/table/create`, {
      store: _userId != null ? _userId : process.env.NEXT_PUBLIC_USER
    }).then(res => {
      console.log(res)
      readTable()
    })
  }

  const readTable = () => {
    axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/table/read`, {
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
      readTable()
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
      setUserId(res.data.data.id)
      setCookie(null, 'userId', res.data.data.id, { path: '/' })
      router.reload()
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Demo Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <br />
        <h1 className={styles.title}>
          Welcome <a>Demo Food</a>
        </h1>
        <div>
          <Image src='/chef.png' alt="" width={150} height={150} className={styles.img_profile} />
        </div>

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
                fontSize: '12px',
                paddingLeft: '20px',
                paddingRight: '20px',
              }}>
              คลิกที่ปุ่มด้านบนเพื่อทดลองใช้งานฟรี ระบบจะสร้างรหัสผู้ใช้งานใหม่ หรือจะใช้งานในโหมด demo ได้เลย
            </p>
          </div>
            :
            <span
              style={
                {
                  margin: '10px',
                }
              }>
              รหัสผู้ใช้ทดสอบ: <strong>{userId}</strong> <Button variant="outlined" startIcon={<LogoutIcon />} size="small" color="primary" onClick={clickLogout}>ออก</Button>
            </span>
        }

        <div className={styles.grid_menu}>
          <Link href={`/products/view`} passHref>
            <div className={styles.card_product}>
              <Image src={'/shelf.png'} alt={''} width={40} height={40} />
              <span>&nbsp;เพิ่มสินค้า</span>
            </div>
          </Link>
          <div className={styles.card_notification} onClick={createTable}>
            <Image src={'/table.png'} alt={''} width={40} height={40} />
            <span>&nbsp;เพิ่มโต๊ะ</span>
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
                        }>โต๊ะ</span>
                      <span
                        style={{
                          fontSize: '60px',
                        }}>{index + 1}</span>
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
                      <div className={styles.view_order}>
                        <span style={
                          {
                            fontSize: '20px',
                            fontWeight: 'bold',
                          }
                        }>
                          {
                            item.count
                          }
                        </span>
                      </div>
                      <Image src={'/table.png'} alt={''} width={100} height={100} objectFit='contain' />
                      <div>
                        <Button variant="outlined" startIcon={item.count == 0 && item.count_wait > 0 ? <HourglassBottomIcon className={styles.hourglass} /> : null} color={item.count == 0 && item.count_wait > 0 ? 'primary' : 'primary'} onClick={() => {
                          clickOrder(index + 1, item.id)
                        }}>{item.count == 0 && item.count_wait > 0 ? 'รอชำระ' : 'สั่งอาหาร'}</Button> {' '}
                        <Button variant="outlined" color="error" disabled={item.count == 0 && item.count_wait == 0 ? false : true} onClick={() => {
                          handleClickOpen(item.id)
                        }}>ลบ</Button>
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
              minHeight: '450px',
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
                height: 'auto',
              }
            } animationData={preparing_food} loop={true} />
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
            <Button fullWidth variant="outlined" startIcon={<LoginIcon />} size="small" color="primary" onClick={clickLogin}>เข้าใช้งานอีกครั้ง</Button>
          </div>
          <div className={styles.main} style={
            {
              marginBottom: '10px',
              border: '1px solid #e0e0e0',
              padding: '20px',
              borderRadius: '5px',
              marginLeft: '3px',
              marginRight: '3px',
              minHeight: '450px',
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
                  <strong>ฟีเจอร์หลัก:</strong><br/>
                  ✔️ เพิ่ม/ลบ โต๊ะไม่จำกัดจำนวน<br/>
                  ✔️ เพิ่ม/ลบ สินค้าไม่จำกัดจำนวน<br/>
                  ✔️ จัดการสินค้าไม่จำกัดจำนวน<br/>
                  ✔️ รับออเดอร์ไม่จำกัดจำนวน<br/>
                  ✔️ ดูใบเสร็จเรียลไทม์<br/>
                  ✔️ QRCode แสกนดูใบเสร็จ/รับออเดอร์โต๊ะ<br/>
                  ✔️ ดูรายการออเดอร์เรียลไทม์<br/>
                  ✔️ บันทึกใบเสร็จไม่จำกัดจำนวน<br/>
                  ✔️ ออกรายงานประจำวัน(on process)<br/>
                </p>
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
  const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/table/read`, {
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

export default Profile
