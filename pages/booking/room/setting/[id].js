import Head from "next/head";
import axios from "axios";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRouter } from "next/router";

const Setting = () => {
    const router = useRouter();
    const { id } = router.query;
    const upload = (event) => {
        let reader = new FileReader();
        const files = event.target.files[0];
        reader.onloadend = () => {
            let data = {
                "image": reader.result,
                "imageType": files.type,
                "room_id": id
            }
            axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/image/upload`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            ).then(response => {
                console.log(response)
            }
            ).catch(error => {
                console.log(error)
            })
        }
        reader.readAsDataURL(files)
    }
    return (
        <div>
            <Head>
                <title>Setting</title>
            </Head>
            <h1>Setting</h1>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="contained" component="label">
                    Upload
                    <input hidden accept="image/*" multiple type="file" onChange={upload} />
                </Button>
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="image/*" type="file" />
                    <PhotoCamera />
                </IconButton>
            </Stack>
            <Stack direction="column" alignItems="center" spacing={2}>
                <TextField id="outlined-basic" label="ชื่อ" variant="outlined" />
                <TextField id="outlined-basic" label="นามสกุล" variant="outlined" />

                <TextField id="outlined-basic" inputProps={{ maxLength: 10 }} label="เบอร์โทร" variant="outlined" />
                <TextField id="outlined-basic" type={'email'} label="อีเมล" variant="outlined" />

                <TextField id="outlined-basic" label="note" variant="outlined" />
                <Stack direction='row' spacing={2}>
                    <Button fullWidth size='large' variant="outlined" color="primary">
                        ยกเลิก
                    </Button>
                    <Button fullWidth size='large' variant="contained" color="primary" >
                        บันทึก
                    </Button>
                </Stack>
            </Stack>
        </div >
    );
}

export default Setting;