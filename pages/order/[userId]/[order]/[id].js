import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../../../styles/Profile.module.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NoSsr from "@mui/material/NoSsr";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from "react-qr-code";

import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';

function Order({ data, data_order }) {
    const router = useRouter();
    const { userId, order, id } = router.query
    const [dataProduct, setDataProduct] = useState(data.data ? data.data : [])
    const [dataOrder, setDataOrder] = useState(data_order.data ? data_order.data : [])
    const [isShare, setIsShare] = useState(false)
    const [isAnimate, setIsAnimate] = useState(false)
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            readOrder();
        }, 3200)
        
        return () => {
            clearInterval(intervalId)
        }
    }, [dataOrder])

    const clickShare = () => {
        setIsShare(true)
    }

    const closeShare = () => {
        setIsShare(false)
        setValue(0)
    }
    const animateStart = () => {
        setIsAnimate(true)
    }
    const animateEnd = () => {
        if (!isShare) {
            setIsAnimate(false)
        }
    }
    const handleScroll = () => {
        setIsShare(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    // create new order
    const createOrder = (productId, amount, status, price, name, image, isActive) => {
        if (isActive) {
            axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/order/create`, {
                store: userId,
                tableId: id,
                productId: productId,
                amount: amount,
                status: /*status*/ 1,
                price: price,
                name: name,
                image: image
            }).then(res => {
                setIsShare(false)
                readOrder()
            })
        }
    }

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

    const updateStatus = (orderId, status) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/order/update`, {
            orderId: orderId,
            status: status
        }).then(res => {
            readOrder()
        })
    }

    const handleClickOpen = (id) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const clickPriceOrder = () => {
        let total = totalPrice()
        if (total > 0) {
            axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/order/price`, {
                tableId: id
            }).then(res => {
                setOpen(false);
                let audio = document.getElementById('myAudio')
                audio.play()
                readOrder()
            })
        }
    }

    const productFillter = (type) => {
        let data = dataProduct.filter(item => item.type === type)
        return data
    }

    return (
        <div>
            <Head>
                <title>รับออเดอร์โต๊ะ {order}</title>
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
                                                    <div key={index}>
                                                        <li className={styles.cart_item} style={
                                                            {
                                                                textDecoration: item.status === 0 ? 'line-through' : 'none'
                                                            }
                                                        }>
                                                            <span className={styles.index}>{index + 1}</span>
                                                            <span className={styles.name}>{item.name}</span>
                                                            <span className={styles.price}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                        </li>
                                                        <div
                                                            style={
                                                                item.status === 3 ?
                                                                    {
                                                                        borderBottom: '2px dotted #e0e0e0',
                                                                        height: '1px',
                                                                    }
                                                                    :
                                                                    {
                                                                        borderBottom: '2px dotted #e0e0e0',
                                                                        paddingBottom: '10px',
                                                                        justifyContent: 'center',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }
                                                            }>
                                                            <Button style={
                                                                {
                                                                    display: item.status == 3 ? 'none' : 'block',
                                                                }
                                                            } variant="outlined" size='small' color="primary" disabled={item.status == 3 ? true : false} onClick={() => {
                                                                updateStatus(item.orderId, 3)
                                                            }}>เสร็จแล้ว</Button>&nbsp;
                                                            <Button style={
                                                                {
                                                                    display: item.status == 3 ? 'none' : 'block',
                                                                }
                                                            } variant="outlined" size='small' color="error" disabled={item.status == 3 ? true : false} onClick={() => {
                                                                updateStatus(item.orderId, 0)
                                                            }}>ยกเลิก</Button>
                                                        </div>
                                                    </div>
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
                                    <QRCode value={`https://workout.duckfollow.co/receipt/${userId}/${order}/${id}`} />
                                </NoSsr>
                                <p align="center"
                                    style={
                                        {
                                            fontSize: '12px',
                                        }
                                    }>
                                    <a href={`https://workout.duckfollow.co/receipt/${userId}/${order}/${id}`} target="_blank" rel="noopener noreferrer">{`https://workout.duckfollow.co/receipt/${userId}/${order}/${id}`}</a>
                                    <br />
                                    สามารถสแกน QR code เพื่อดูใบเสร็จและออเดอร์ได้
                                </p>
                            </div>
                        </div>
                        <Stack direction="row" spacing={2} style={
                            {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        }>
                            <Button variant="outlined" startIcon={<AddIcon />} color="primary" onClick={clickShare}>เพิ่ม ออเดอร์</Button><Button variant="outlined" startIcon={<PaidOutlinedIcon />} color="success" onClick={handleClickOpen}>ชำระเงิน</Button>
                        </Stack>
                    </div>
                </div>
            </div>

            <div className={styles.view_share} show={isShare ? "true" : !isAnimate ? "false" : "true"}>
                <div className={styles.view_share_content} animation={isShare ? "true" : "false"} onAnimationEnd={animateEnd} onAnimationStart={animateStart}>
                    <div className={styles.content_share}>
                        <NoSsr>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="อาหาร" {...a11yProps(0)} />
                                        <Tab label="ของหวาน" {...a11yProps(1)} />
                                        <Tab label="เครื่องดื่ม" {...a11yProps(2)} />
                                        <Tab label="ปิด" {...a11yProps(2)} onClick={closeShare} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <div className={styles.grid_product}>
                                        {
                                            productFillter(1).map((item, index) => {
                                                return (
                                                    <div className={item.isActive ? styles.card : styles.card_disable} key={item.productId} style={{
                                                        cursor: item.isActive ? 'pointer' : 'not-allowed',
                                                    }}>
                                                        <div className={styles.view_table} onClick={
                                                            () => {
                                                                createOrder(item.productId, item.amount, item.status, item.price, item.name, item.image, item.isActive)
                                                            }
                                                        }>
                                                            <div className={styles.text} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <span
                                                                    style={
                                                                        {
                                                                            fontSize: '20px',
                                                                        }
                                                                    }>{item.name}</span>
                                                                <span
                                                                    style={{
                                                                        fontSize: '20px',
                                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                                <span
                                                                    style={
                                                                        {
                                                                            fontSize: '12px',
                                                                        }
                                                                    }>
                                                                    (id: {item.productId})
                                                                </span>
                                                            </div>
                                                            <div className={styles.table} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <Image src={item.image} alt={''} width={100} height={100} objectFit='contain' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <div className={styles.grid_product}>
                                        {
                                            productFillter(2).map((item, index) => {
                                                return (
                                                    <div className={item.isActive ? styles.card : styles.card_disable} key={item.productId} style={{
                                                        cursor: item.isActive ? 'pointer' : 'not-allowed',
                                                    }}>
                                                        <div className={styles.view_table} onClick={
                                                            () => {
                                                                createOrder(item.productId, item.amount, item.status, item.price, item.name, item.image, item.isActive)
                                                            }
                                                        }>
                                                            <div className={styles.text} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <span
                                                                    style={
                                                                        {
                                                                            fontSize: '20px',
                                                                        }
                                                                    }>{item.name}</span>
                                                                <span
                                                                    style={{
                                                                        fontSize: '20px',
                                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                                <span
                                                                    style={
                                                                        {
                                                                            fontSize: '12px',
                                                                        }
                                                                    }>
                                                                    (id: {item.productId})
                                                                </span>
                                                            </div>
                                                            <div className={styles.table} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <Image src={item.image} alt={''} width={100} height={100} objectFit='contain' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <div className={styles.grid_product}>
                                        {
                                            productFillter(3).map((item, index) => {
                                                return (
                                                    <div className={item.isActive ? styles.card : styles.card_disable} key={item.productId} style={{
                                                        cursor: item.isActive ? 'pointer' : 'not-allowed',
                                                    }}>
                                                        <div className={styles.view_table} onClick={
                                                            () => {
                                                                createOrder(item.productId, item.amount, item.status, item.price, item.name, item.image, item.isActive)
                                                            }
                                                        }>
                                                            <div className={styles.text} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <span
                                                                    style={
                                                                        {
                                                                            fontSize: '20px',
                                                                        }
                                                                    }>{item.name}</span>
                                                                <span
                                                                    style={{
                                                                        fontSize: '20px',
                                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                                <span
                                                                    style={
                                                                        {
                                                                            fontSize: '12px',
                                                                        }
                                                                    }>
                                                                    (id: {item.productId})
                                                                </span>
                                                            </div>
                                                            <div className={styles.table} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <Image src={item.image} alt={''} width={100} height={100} objectFit='contain' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </TabPanel>
                            </Box>
                        </NoSsr>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"คุณต้องการชำระออเดอร์นี้ใช่หรือไม่?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ตรวจสอบข้อมูลก่อนการชำระเงิน จำนวน <strong>{totalPrice().toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</strong> หากต้องการชำระเงินกรุณากดปุ่มยืนยัน
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>ยกเลิก</Button>
                    <Button onClick={clickPriceOrder}>ยืนยัน</Button>
                </DialogActions>
            </Dialog>
            <audio id="myAudio" src='/sound.mp3'></audio>
        </div>
    )
}

export async function getServerSideProps(context) {
    const userId = context.query.userId
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/product/read`, {
        "store": userId
    })

    const res_order = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/order/read`, {
        "store": userId,
        "tableId": context.query.id
    })

    const data = await res.data
    const data_order = await res_order.data
    return {
        props: {
            data,
            data_order
        },
    }
}

export default Order
