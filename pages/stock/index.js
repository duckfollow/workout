import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import styles from '../../styles/Profile.module.css'
import axios from 'axios'

import { useState, useEffect, useRef } from 'react'
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
import FastfoodIcon from '@mui/icons-material/Fastfood';
import IcecreamIcon from '@mui/icons-material/Icecream';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import GridViewIcon from '@mui/icons-material/GridView';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function View({ data, dataProdcut, userId }) {
    const router = useRouter();
    const [dataGroup, setDataGroup] = useState(data.data ? data.data : [])
    const [dataProduct, setDataProduct] = useState(dataProdcut.data ? dataProdcut.data : [])
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [idDelete, setIdDelete] = useState();
    const [imageFile, setImageFile] = useState(null)
    const [imageType, setImageType] = useState()
    const refNameGroup = useRef('refNameGroup');
    const refProductId = useRef('refProductId');
    const refNameProduct = useRef('refNameProduct');
    const refPrice = useRef('refPrice');
    const refUnit = useRef('refUnit');
    const refDescription = useRef('refDescription');
    const refGroup = useRef('refGroup');

    const dataList = dataGroup.map((item, index) => {
        return {
            id: item.id,
            label: item.name,
        }
    })

    const upload = (event) => {
        let reader = new FileReader();
        const files = event.target.files[0];
        setImageType(files.type)
        reader.onloadend = () => {
            setImageFile(reader.result)
        }
        reader.readAsDataURL(files)
    }

    const removeImage = () => {
        setImageFile(null)
    }

    const handleClickOpen = (id) => {
        setIdDelete(id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                        {children}
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

    const productFillter = (group) => {
        let data = dataProduct.filter(item => item.group === group)
        return data
    }

    const clickEdit = (id) => {
        router.push(`/products/edit/${id}`)
    }

    const clickAdd = () => {
        let data = {
            name: refNameGroup.current.value,
            store: userId
        }
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/stock/group/create`, data).then(res => {
            readGroup()
        })
    }

    const readGroup = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/stock/group/getall`, {
            store: userId
        }).then(res => {
            setDataGroup(res.data.data)
            refNameGroup.current.blur()
        })
    }

    const createProduct = () => {
        try {
            let data = {
                productId: refProductId.current.value,
                name: refNameProduct.current.value,
                image: imageFile,
                imageType: imageType,
                price: refPrice.current.value,
                amount: refUnit.current.value,
                group: dataList.find(item => item.label === refGroup.current.value).id,
                detail: refDescription.current.value,
                store: userId,
            }
            axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/stock/product/create`, data).then(res => {
                readProduct()
                setImageType(null)
                setImageFile(null)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const readProduct = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/stock/product/getall`, {
            store: userId
        }).then(res => {
            setDataProduct(res.data.data)
        })
    }


    return (
        <div>
            <Head>
                <title>Demo Stock</title>
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
            <NoSsr>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} variant="scrollable" aria-label="basic tabs example">
                            <Tab icon={<AddIcon />} iconPosition="start" label="เพิ่มสินค้าของคุณ"  {...a11yProps(0)} />
                            {
                                dataGroup.map((item, index) => {
                                    return (
                                        <Tab key={index} label={item.name} {...a11yProps(index + 1)} />
                                    )
                                })
                            }
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Box sx={{ width: '100%' }} style={
                            {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }
                        }>
                            <Stack spacing={2} className={styles.view_input}>
                                <TextField inputRef={refNameGroup} label="group" />
                                <Button variant="contained" onClick={clickAdd}>เพิ่มประเภท</Button>
                                {
                                    imageFile === null ?
                                        <div className={styles.box_upload}>
                                            <input type="file" className={styles.inputfile} onChange={upload} accept="image/*" />
                                            <div className={styles.grid}>
                                                <Image src='/photo.png' width={50} height={50} alt="image upload" />
                                                <p>เพิ่มรูปภาพ</p>
                                                หรือลากแล้ววาง
                                            </div>
                                        </div> : <div className={styles.box_upload}>
                                            <button className={styles.removeButton} onClick={removeImage}>
                                                <Image className={styles.cancel} src="/cancel.png" width={12} height={12} alt="cancel" />
                                            </button>
                                            <Image className={styles.imageupload} src={imageFile} width={500} height={350} alt="image upload" objectFit="cover" />
                                        </div>
                                }
                                <TextField label="รหัสสินค้า" inputRef={refProductId} />
                                <TextField label="ชื่อ" inputRef={refNameProduct} />
                                <TextField label="ราคา" inputRef={refPrice} />
                                <TextField label="จำนวน" inputRef={refUnit} />
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={dataList}
                                    renderInput={(params) => <TextField inputRef={refGroup} {...params} label="group" fullWidth />}
                                />
                                <TextField label="รายละเอียด" inputRef={refDescription} />
                                <Button variant="contained" onClick={createProduct}>เพิ่มสต็อก</Button>
                            </Stack>
                        </Box>
                    </TabPanel>
                    {
                        dataGroup.map((item, index) => {
                            return (
                                <TabPanel key={index} value={value} index={index + 1}>
                                    <div className={styles.grid_product}>
                                        {
                                            productFillter(item.id).map((item, index) => {
                                                return (
                                                    <div className={styles.card} key={item.productId}>
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
                                                                    style={
                                                                        {
                                                                            fontSize: '20px',
                                                                        }
                                                                    }>
                                                                    {item.amount}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontSize: '12px',
                                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                            </div>
                                                            <div className={styles.table} style={
                                                                {
                                                                    width: '50%',
                                                                }
                                                            }>
                                                                <Image src={item.image} alt={''} width={150} height={150} objectFit='contain' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </TabPanel>
                            )
                        })
                    }
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
                        <Button>ลบ</Button>
                    </DialogActions>
                </Dialog>
            </NoSsr>
        </div>
    );

}

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/stock/group/getall`, {
        "store": userId
    })
    const data = await res.data

    const resProdcut = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/stock/product/getall`, {
        "store": userId
    })
    const dataProdcut = await resProdcut.data

    return {
        props: {
            data,
            dataProdcut,
            userId
        },
    }
}

export default View