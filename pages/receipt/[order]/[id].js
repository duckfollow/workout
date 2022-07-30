import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../../styles/Profile.module.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import axios from 'axios'
import NoSsr from "@mui/material/NoSsr";
import QRCode from "react-qr-code";

function Order({ data_order }) {
    const router = useRouter();
    const { order, id } = router.query
    const [dataOrder, setDataOrder] = useState(data_order.data ? data_order.data : [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            readOrder();
        }, 3200)
    
        return () => {
          clearInterval(intervalId)
        }
      }, [dataOrder])

    // read order
    const readOrder = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/order/read`, {
            store: process.env.NEXT_PUBLIC_USER,
            tableId: id
        }).then(res => {
            setDataOrder(res.data.data)
        })
    }

    const totalPrice = () => {
        let total = 0
        dataOrder.map(item => {
            if (item.status === 3) {
                total += item.price
            }
        })
        return total
    }

    return (
        <div>
            <Head>
                <title>ใบเสร็จโต๊ะ {order}</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.view_receipt}>
                <div className={styles.container_receipt}>
                    <div className={styles.receipt_box}>
                        <div className={styles.head_receipt}>
                            <div className={styles.logo_receipt}>
                                <Image src="/chef.png" width={42} height={42} />
                            </div>
                            <div className={styles.number}>
                                <div className={styles.date}>{(new Date()).toLocaleDateString('th-TH')}</div>
                                <div className={styles.ref}>โต๊ะ-{order}</div>
                            </div>
                        </div>
                        <div className={styles.body_receipt}>
                            <div className={styles.info}>
                                <div className={styles.welcome}>Receipt, <span className={styles.username}>Demo Food</span></div>
                                <p>จำนวน ({dataOrder.length}) รายการ</p>
                            </div>
                            <div className={styles.cart_receipt}>
                                <div className={styles.title_receipt}>รายการที่สั่ง</div>
                                <div className={styles.content_receipt}>
                                    <ul className={styles.cart_list_receipt}>
                                        {
                                            dataOrder.map((item, index) => {
                                                return (
                                                    <li className={styles.cart_item} key={index} style={
                                                        {
                                                            textDecoration: item.status === 0 ? 'line-through' : 'none'
                                                        }
                                                    }>
                                                        <span className={styles.index}>{index + 1}</span>
                                                        <span className={styles.name}>{item.name}</span>
                                                        <span className={styles.price}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <div className={styles.total}>
                                        <span>รวม</span>
                                        <span className={styles.total_price}>{totalPrice().toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.foot}>
                            <div style={
                                {
                                    background: 'white',
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column'
                                }
                            }>
                                <NoSsr>
                                    <QRCode value={`https://workout.duckfollow.co/receipt/${order}/${id}`} />
                                </NoSsr>
                                <span
                                    style={
                                        {
                                            fontSize: '12px',
                                        }
                                    }>
                                    สามารถสแกน QR code เพื่อดูใบเสร็จและออเดอร์ได้
                                </span>
                            </div>
                        </div>
                        {/* <div className={styles.view_button_receipt}>
                            <Button variant="outlined" color="primary" onClick={clickShare}>เพิ่ม ออเดอร์</Button> {' '} <Button variant="contained" color="success" onClick={handleClickOpen}>ชำระเงิน</Button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const res_order = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/order/read`, {
        "store": process.env.NEXT_PUBLIC_USER,
        "tableId": context.query.id
    })

    const data_order = await res_order.data
    return {
        props: {
            data_order
        },
    }
}

export default Order
