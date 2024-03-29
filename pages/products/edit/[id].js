import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../styles/Profile.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function EditProduct({ data, userId }) {
    const router = useRouter()
    const productId = router.query.id;
    const [imageFile, setImageFile] = useState(data.data.image)
    const [imageType, setImageType] = useState(null)
    const [name, setName] = useState(data.data.name)
    const [type, setType] = useState(data.data.type)
    const [price, setPrice] = useState(data.data.price)
    const [detail, setDetail] = useState(data.data.details)
    const [isActive, setIsActive] = useState(data.data.isActive)
    const [loading, setLoading] = useState(false)
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

    const editProduct = () => {
        setLoading(true)
        let data = {
            "productId": productId,
            "name": name,
            "image": imageFile,
            "imageType": imageType,
            "price": price,
            "details": detail,
            "status": 1,
            "isActive": isActive,
            "amount": 0,
            "type": type,
            "store": userId
        }
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/product/update`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setImageFile(null)
            setImageType(null)
            setName("")
            setDetail("")
            setLoading(false)
            router.back()
        })
    }

    const handleName = (event) => {
        setName(event.target.value)
    }

    const handlePrice = (event) => {
        setPrice(event.target.value)
    }

    const handleDetail = (event) => {
        setDetail(event.target.value)
    }

    const handleType = (event) => {
        setType(event.target.value)
    }

    return (
        <div className={styles.container} style={
            {
                padding: "20px",
            }
        }>
            <Head>
                <title>แก้ไขสินค้าของคุณ</title>
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
            <Stack
                component="form"
                spacing={2}
                className={styles.view_input}
                noValidate
                autoComplete="off"
            >
                {/* <input className={styles.inputText} type="text" placeholder="ชื่อ" value={name} onChange={handleName} /> */}
                <TextField label="ชื่อ" variant="outlined" value={name} onChange={handleName} />
                {/* <input className={styles.inputText} type="number" placeholder="ราคา" value={price} onChange={handlePrice} /> */}
                <TextField
                    label="ราคา"
                    type="number"
                    value={price}
                    onChange={handlePrice}
                />
                {/* <FormControl sx={{ m: 1}}> */}
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={type}
                    onChange={handleType}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value={1}>อาหาร</MenuItem>
                    <MenuItem value={2}>ของหวาน</MenuItem>
                    <MenuItem value={3}>เครื่องดื่ม</MenuItem>
                </Select>
                {/* </FormControl> */}
                {/* <textarea className={styles.inputTextArea} type="text" rows="4" cols="50" placeholder="รายละเอียด"  /> */}
                <TextField
                    label="รายละเอียด"
                    multiline
                    rows={4}
                    value={detail}
                    onChange={handleDetail}
                />

                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={isActive} onChange={() => setIsActive(!isActive)} />} label={isActive ? 'สถานะ: เปิดใช้งาน' : 'สถานะ: ปิดใช้งาน'} />
                </FormGroup>

                {/* <button className={styles.button} onClick={editProduct}>อัพเดทสินค้า</button> */}
                <Button variant="contained" onClick={editProduct} size="large">
                    อัพเดทสินค้า
                </Button>
            </Stack>
            {loading ?
                <div className={styles.loading}>
                    <div className={styles.loader}></div>
                </div> : null
            }
        </div>
    )
}

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/product/readById`, {
        "productId": context.query.id,
    })
    const data = await res.data
    return {
        props: {
            data,
            userId
        },
    }
}

export default EditProduct
