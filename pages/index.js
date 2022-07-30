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

function Profile({ data }) {
  const router = useRouter();
  const [dataTable, setDataTable] = useState(data)
  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState();

  useEffect(() => {
    const intervalId = setInterval(() => {
      readTable();
    }, 1000)

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
      store: process.env.NEXT_PUBLIC_USER
    }).then(res => {
      console.log(res)
      readTable()
    })
  }

  const readTable = () => {
    axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/table/read`, {
      store: process.env.NEXT_PUBLIC_USER
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
    router.push(`/order/${order}/${id}`)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Demo Food</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome <a>Demo Food</a>
        </h1>
        <div>
          <Image src='/chef.png' alt="" width={150} height={150} className={styles.img_profile} />
        </div>

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
                        <Button variant="outlined" color="primary" onClick={() => {
                          clickOrder(index + 1, item.id)
                        }}>สั่งอาหาร</Button> {' '}
                        <Button variant="outlined" color="error" disabled={item.count == 0 ? false : true} onClick={() => {
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
    </div>
  )
}

export async function getStaticProps() {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/table/read`, {
    "store": process.env.NEXT_PUBLIC_USER
  })
  const data = await res.data

  return {
    props: {
      data
    }
  }
}

export default Profile
