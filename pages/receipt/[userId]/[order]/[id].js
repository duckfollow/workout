import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../../../styles/Profile.module.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import axios from 'axios'
import NoSsr from "@mui/material/NoSsr";
import QRCode from "react-qr-code";
import LoopIcon from '@mui/icons-material/Loop';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';

function Order({ data_order }) {
    const router = useRouter();
    const { userId, order, id } = router.query
    const [dataOrder, setDataOrder] = useState(data_order.data ? data_order.data : [])
    const [switchQR, setSwitchQR] = useState(false);
    const [saveReceipt, setSaveReceipt] = useState(false);

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
            store: userId,
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

    const downloadImage = (blob, fileName) => {
        const fakeLink = window.document.createElement("a");
        fakeLink.style = "display:none;";
        fakeLink.download = fileName;

        fakeLink.href = blob;

        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);

        fakeLink.remove();

        setSaveReceipt(false)
    };

    return (
        <div>
            <Head>
                <title>ใบเสร็จโต๊ะ {order}</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.view_receipt}>
                <div id="capture" className={saveReceipt ? styles.container_receipt_save : styles.container_receipt}>
                    <div className={styles.receipt_box}>
                        <div className={styles.head_receipt}>
                            <div className={styles.logo_receipt}>
                                <Image src="/chef.png" width={42} height={42} />
                            </div>
                            <div className={styles.number}>
                                <div className={styles.date}>{(new Date()).toLocaleDateString('th-TH')}</div>
                                <div className={styles.ref}>โต๊ะที่ {order}</div>
                            </div>
                        </div>
                        <div className={styles.body_receipt}>
                            <div className={styles.info}>
                                <div className={styles.welcome}>Receipt, <span className={styles.username}>Demo Food ({userId})</span></div>
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
                                    <QRCode value={switchQR ? `https://workout.duckfollow.co/receipt/${userId}/${order}/${id}` : `https://workout.duckfollow.co/order/${userId}/${order}/${id}`} />
                                </NoSsr>
                                <p align="center"
                                    style={
                                        {
                                            fontSize: '12px',
                                        }
                                    }>
                                    <a href={switchQR ? `https://workout.duckfollow.co/receipt/${userId}/${order}/${id}` : `https://workout.duckfollow.co/order/${userId}/${order}/${id}`} target="_blank" rel="noopener noreferrer">{switchQR ? `https://workout.duckfollow.co/receipt/${userId}/${order}/${id}` : `https://workout.duckfollow.co/order/${userId}/${order}/${id}`}</a>
                                    <br />
                                    {
                                        switchQR ? 'สามารถสแกน QR code เพื่อดูใบเสร็จได้' : 'สามารถสแกน QR code เพื่อรับออเดอร์ได้'
                                    }
                                </p>
                                <Stack direction="row" spacing={2} style={
                                    {
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }
                                }>
                                    <Button variant="outlined" startIcon={<LoopIcon />} size='small' color="primary" onClick={() => {
                                        setSwitchQR(!switchQR)
                                    }}>{switchQR ? 'QRCode สั่งอาหาร' : 'QRCode ใบเสร็จ'}</Button>
                                    <IconButton variant="outlined" size='small' color="success" onClick={() => {
                                        setSaveReceipt(true)
                                        setTimeout(() => {
                                            html2canvas(document.querySelector("#capture")).then(canvas => {
                                                // document.body.appendChild(canvas)
                                                const image = canvas.toDataURL("image/png", 1.0);
                                                downloadImage(image, `receipt_${userId}_${order}_${id}_${(new Date().toISOString())}.png`);
                                            });
                                        }, 2000)
                                    }}>
                                        <DownloadIcon />
                                    </IconButton>
                                </Stack>
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
        "store": context.query.userId,
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
