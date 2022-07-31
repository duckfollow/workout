import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import styles from '../../styles/Profile.module.css'
import axios from 'axios'

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NoSsr from "@mui/material/NoSsr";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import AddIcon from '@mui/icons-material/Add';

function View({ data, userId }) {
    const router = useRouter();
    const [dataProduct, setDataProduct] = useState(data.data ? data.data : [])
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [idDelete, setIdDelete] = useState();

    const handleClickOpen = (id) => {
        setIdDelete(id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const readProduct = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/product/read`, {
            store: userId
        }).then(res => {
            setDataProduct(res.data.data)
        }
        )
    }

    const deleteProduct = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/product/delete`, {
            productId: idDelete
        }).then(res => {
            setOpen(false);
            readProduct()
        })
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

    const productFillter = (type) => {
        let data = dataProduct.filter(item => item.type === type)
        return data
    }

    const clickEdit = (id) => {
        router.push(`/products/edit/${id}`)
    }

    const clickAdd = () => {
        router.push(`/products/add`)
        setValue(0)
    }

    return (
        <div>
            <Head>
                <title>Demo Food</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NoSsr>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} variant="scrollable" aria-label="basic tabs example">
                            <Tab label="อาหาร" {...a11yProps(0)} />
                            <Tab label="ของหวาน" {...a11yProps(1)} />
                            <Tab label="เครื่องดื่ม" {...a11yProps(2)} />
                            <Tab icon={<AddIcon />} iconPosition="start" label="เพิ่มสินค้าของคุณ" onClick={clickAdd} />
                        </Tabs>
                    </Box>
                    {/* <Link href={`/products/add`} passHref>
                        <div className={styles.card_product} style={
                            {
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }
                        }>
                            <Image src={'/plus.png'} alt={''} width={40} height={40} />
                            <span>&nbsp;เพิ่มสินค้า</span>
                        </div>
                        <Button variant="outlined" startIcon={<AddIcon />} color="primary">เพิ่มสินค้าของคุณ</Button>
                    </Link> */}
                    <TabPanel value={value} index={0}>
                        <div className={styles.grid_product}>
                            {
                                productFillter(1).map((item, index) => {
                                    return (
                                        <div className={item.isActive ? styles.card : styles.card_disable} key={item.productId}>
                                            <div className={styles.view_table}>
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
                                                    <div
                                                        style={
                                                            {
                                                                marginTop: '10px',
                                                            }
                                                        }>
                                                        <Button variant="outlined" color="primary" size="small" disabled={item.status == 99 ? true : false} onClick={() => {
                                                            clickEdit(item.productId)
                                                        }}>แก้ไข</Button> {' '}
                                                        <Button variant="outlined" color="error" size="small" disabled={item.status == 99 ? true : false} onClick={() => {
                                                            handleClickOpen(item.productId)
                                                        }}>ลบ</Button>
                                                    </div>
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
                                        <div className={item.isActive ? styles.card : styles.card_disable} key={item.productId}>
                                            <div className={styles.view_table}>
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
                                                    <div style={
                                                        {
                                                            marginTop: '10px',
                                                        }
                                                    }>
                                                        <Button variant="outlined" color="primary" size="small" disabled={item.status == 99 ? true : false} onClick={() => {
                                                            clickEdit(item.productId)
                                                        }}>แก้ไข</Button> {' '}
                                                        <Button variant="outlined" color="error" size="small" disabled={item.status == 99 ? true : false} onClick={() => {
                                                            handleClickOpen(item.productId)
                                                        }}>ลบ</Button>
                                                    </div>
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
                                        <div className={item.isActive ? styles.card : styles.card_disable} key={item.productId}>
                                            <div className={styles.view_table}>
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
                                                    <div style={
                                                        {
                                                            marginTop: '10px',
                                                        }
                                                    }>
                                                        <Button variant="outlined" color="primary" size="small" disabled={item.status == 99 ? true : false} onClick={() => {
                                                            clickEdit(item.productId)
                                                        }}>แก้ไข</Button> {' '}
                                                        <Button variant="outlined" color="error" size="small" disabled={item.status == 99 ? true : false} onClick={() => {
                                                            handleClickOpen(item.productId)
                                                        }}>ลบ</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </TabPanel>
                </Box>

                <Dialog
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{`คุณต้องการลบรายการนี้ใช่หรือไม่?`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            คุณจะไม่สามารถกู้คืนรายการนี้ได้ id:{idDelete} หากคุณลบรายการนี้
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>ยกเลิก</Button>
                        <Button onClick={deleteProduct}>ลบ</Button>
                    </DialogActions>
                </Dialog>
            </NoSsr>
        </div>
    );

}

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/product/read`, {
        "store": userId
    })
    const data = await res.data
    return {
        props: {
            data,
            userId
        },
    }
}

export default View