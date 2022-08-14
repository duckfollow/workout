import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "../../styles/User.module.css";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

const Profile = ({ userId, nameUser, imageUser }) => {
    const router = useRouter();
    const [image, setImage] = useState(imageUser);
    const [name, setName] = useState(nameUser);
    const [imageType, setImageType] = useState(null);

    const upload = (event) => {
        let reader = new FileReader();
        const files = event.target.files[0];
        setImageType(files.type);
        reader.onloadend = () => {
            setImage(reader.result);
        }
        reader.readAsDataURL(files)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let data = {
            userId: userId,
            name: name,
            image: image,
            imageType: imageType
        }
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/edit`, data).then(res => {
            getUser();
        }).catch(err => {
            console.log(err);
        })
    }

    const getUser = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/readById`, {
            id: userId
        }).then(res => {
            setCookie(null, 'userId', res.data.data.id, { path: '/' })
            setCookie(null, 'name', res.data.data.name, { path: '/' })
            setCookie(null, 'image', res.data.data.image, { path: '/' })
            setCookie(null, 'isfirstLogin', res.data.data.isfirstLogin, { path: '/' })
            router.replace('/');
        }).catch(err => {

        })
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Profile</title>
            </Head>
            <div spacing={2} className={styles.main}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Stack direction="column" spacing={2}>
                                <div style={
                                    {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                    }
                                }>
                                    <Image src={image} alt="user" width={200} height={200} style={{
                                        borderRadius: "50%"
                                    }} />
                                    <IconButton color="primary" aria-label="upload picture" component="label">
                                        <input hidden accept="image/*" type="file" onChange={
                                            (event) => {
                                                upload(event)
                                            }
                                        } />
                                        <PhotoCamera />
                                    </IconButton>
                                </div>

                                <TextField id="outlined-basic" label="user id" value={userId} disabled variant="outlined" />
                                <TextField id="outlined-basic" label="ชื่อ" value={name} variant="outlined" onChange={
                                    (event) => {
                                        setName(event.target.value)
                                    }
                                } />
                                <Stack direction='row' spacing={2}>
                                    <Button fullWidth size='large' variant="outlined" color="primary" onClick={
                                        () => {
                                            router.replace('/');
                                        }
                                    }>
                                        ยกเลิก
                                    </Button>
                                    <Button fullWidth size='large' variant="contained" color="primary" onClick={handleSubmit} >
                                        บันทึก
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : '';
    const nameUser = cookies.name !== undefined && cookies.name !== "null" ? cookies.name : '';
    const imageUser = cookies.image !== undefined && cookies.image !== "null" ? cookies.image : '/tv-show.png';
    return {
        props: {
            userId,
            nameUser,
            imageUser
        }
    }
}

export default Profile;

