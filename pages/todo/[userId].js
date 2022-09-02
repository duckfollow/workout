import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/todo.module.css";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { NoSsr } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Collapse from '@mui/material/Collapse';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
const { AppBar } = require('../../components')
import CheckIcon from '@mui/icons-material/Check';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { io } from 'socket.io-client';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { HexColorPicker } from "react-colorful";

const Todo = ({ data, userId }) => {
    // fake data generator
    const getItems = (count, offset = 0) =>
        Array.from({ length: count }, (v, k) => k).map(k => ({
            id: `item-${k + offset}`,
            content: `item ${k + offset}`
        }));
    const router = useRouter();

    const [items, setItems] = useState(getItems(10));
    const [selected, setSelected] = useState(getItems(5, 10));
    const [groupName, setGroupName] = useState("");
    const [groupList, setGroupList] = useState(data);
    const [expanded, setExpanded] = useState({});
    const [editstate, setEditState] = useState({})
    const [editstateGroup, setEditStateGroup] = useState({})
    const [groupId, setGroupId] = useState(0);
    const [todo, setTodo] = useState('');
    const [name, setName] = useState('')
    const [groupText, setGroupText] = useState('')
    const [_userId, setUserId] = useState(userId);
    const cookies = parseCookies()
    const socket = io(process.env.NEXT_PUBLIC_URL_WEBSOCKET, { transports: ['websocket'] });
    const [color, setColor] = useState("#aabbcc");

    const id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    useEffect(() => {
        socket.connect();
        socket.on("message", data => {
            if (data.userId === _userId) {
                readData();
            }
        });

        return () => {
            socket.disconnect();
        }
    }, [])

    const handlepost = () => {
        setTimeout(() => {
            socket.connect();
            socket.emit("message", { userId });
        }, 300);
    };

    const getList = id => {
        return id === 'droppable' ? items : selected;
    }

    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const grid = 8;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid,
        margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "#ebe9e9",
        borderRadius: "5px",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "lightgrey",
        minHeight: 80,
        padding: grid,
        width: 290
    });


    const _onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const _items = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        setItems(_items);
    }

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const _items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            if (source.droppableId === 'droppable2') {
                setSelected(_items);
            } else {
                setItems(_items);
            }
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            setItems(result.droppable)
            setSelected(result.droppable2)
        }
    };

    const onDragEndTest = result => {
        try {
            const { source, destination } = result;

            let groupId1 = source.droppableId.split("-")[1];
            let groupId2 = destination.droppableId.split("-")[1];
            if (!destination) {
                return;
            }

            if (source.droppableId === destination.droppableId) {
                let data = groupList
                let index = data.data.findIndex((item) => item.id == groupId1);

                const _items = reorder(
                    data.data[index].todo_lists,
                    source.index,
                    destination.index
                );

                data.data[index].todo_lists = _items;
                setGroupList(groupList => ({ ...groupList, ...data }));
            } else {
                let data = groupList
                let index = data.data.findIndex((item) => item.id == groupId1);
                let index2 = data.data.findIndex((item) => item.id == groupId2);

                const result = move(
                    data.data[index].todo_lists,
                    data.data[index2].todo_lists,
                    source,
                    destination
                );
                data.data[index].todo_lists = result[`droppable-${groupId1}`];
                data.data[index2].todo_lists = result[`droppable-${groupId2}`];
                setGroupList(groupList => ({ ...groupList, ...data }));
            }
            updateTodoAll(groupList.data)
        } catch (error) {
        }
    }

    const createGroup = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/group/create`, {
            store: userId,
            name: groupName,
        }).then((response) => {
            console.log(response);
            setGroupName("");
            // readData();
            handlepost()
        }, (error) => {
            console.log(error);
        });
    }

    const readData = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/getall`, {
            "store": userId
        }).then((response) => {
            console.log(response);
            setGroupList(response.data);
        });
    }

    const createTodo = () => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/create`, {
            store: userId,
            group: groupId,
            name: todo,
        }).then((response) => {
            setTodo("");
            // readData();
            handlepost()
            resetAddTodo();
        }, (error) => {
            console.log(error);
        });
    }

    const updateTodo = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/update`, {
            id: id,
            name: name,
        }).then((response) => {
            // readData();
            handlepost()
        }, (error) => {
            console.log(error);
        });
    }

    const updateTodoStatus = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/update/status`, {
            id: id
        }).then((response) => {
            // readData();
            handlepost()
        }, (error) => {
            console.log(error);
        });
    }

    const updateGroup = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/group/update`, {
            id: id,
            name: groupText,
            color: color
        }).then((response) => {
            // readData();
            handlepost()
        }, (error) => {
            console.log(error);
        });
    }

    const updateTodoAll = (data) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/update/all`, data).then((response) => {
            // readData();
            handlepost()
            resetAddTodo();
        }, (error) => {
            console.log(error);
        });
    }

    const resetAddTodo = () => {
        let _expanded = expanded;
        for (const [key, value] of Object.entries(_expanded)) {
            _expanded[key] = false;
        }
        setExpanded(expanded => ({
            ...expanded,
            ..._expanded
        }));
    }

    const deleteTodo = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/delete`, {
            id: id,
        }).then((response) => {
            // readData();
            handlepost()
        })
    }

    const deleteGroup = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/group/delete`, {
            id: id,
        }).then((response) => {
            // readData();
            handlepost()
        })
    }

    const clickTry = () => {
        let userId = randomString()
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/create`, {
            id: userId,
        }).then(res => {
            setUserId(userId)
            setCookie(null, 'userId', userId, { path: '/' })
            setCookie(null, 'isfirstLogin', res.data.data.isfirstLogin, { path: '/' })
            router.reload()
        })
    }

    const randomString = () => {
        return (Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4)).toUpperCase();
    }

    const clickLogout = () => {
        destroyCookie(null, 'userId', { path: '/' })
        router.reload()
    }

    const orderGroups = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/group/update/all`, {
            id: id,
            store: userId
        }).then((response) => {
            // readData();
            handlepost()
        })
    }

    return (
        <div>
            <Head>
                <title>Todo</title>
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
            {/* <AppBar /> */}
            <div style={
                {
                    minWidth: '100vw',
                    minHeight: '100vh',
                    overflowX: 'scroll',
                    padding: 20,
                }
            }>
                <NoSsr>
                    <DragDropContext onDragEnd={onDragEndTest}>
                        <Stack direction="row" spacing={2}>

                            {groupList.data.map((group, index) => {
                                return (
                                    <div key={group.id}>
                                        <div className={styles.header_list}>
                                            <Stack direction="row" spacing={1} justifyContent={Boolean(editstateGroup[`key${group.id}`]) ? 'center' : 'flex-end'} alignItems={'center'}>
                                                <IconButton aria-label="swap" size="small" onClick={() => {
                                                    orderGroups(group.id)
                                                }} style={
                                                    {
                                                        display: !Boolean(editstateGroup[`key${group.id}`]) ? 'block' : 'none',
                                                        width: '28px',
                                                        height: '28px'
                                                    }
                                                }>
                                                    <SwapHorizIcon fontSize="inherit" />
                                                </IconButton>
                                                <span style={{
                                                    width: '100%',
                                                    display: !Boolean(editstateGroup[`key${group.id}`]) ? 'block' : 'none',
                                                    color: `${group.color}`
                                                }}>{group.name}</span>
                                                <Stack direction='column' spacing={1} justifyContent="center" alignItems={'center'} style={
                                                    {
                                                        display: Boolean(editstateGroup[`key${group.id}`]) ? 'block' : 'none'
                                                    }
                                                }>
                                                    <TextField value={groupText} multiline fullWidth sx={{
                                                        "& .MuiInputBase-root": {
                                                            color: `${color}`
                                                        }
                                                    }} onChange={
                                                        (e) => {
                                                            setGroupText(e.target.value)
                                                        }
                                                    } />
                                                    <HexColorPicker color={color} onChange={setColor} />
                                                    <Stack direction="row" spacing={1} alignItems={'center'}>
                                                        <IconButton aria-label="edit" size="small" onClick={
                                                            () => {
                                                                let _editstateGroup = editstateGroup;
                                                                for (const [key, value] of Object.entries(_editstateGroup)) {
                                                                    _editstateGroup[key] = false;
                                                                }
                                                                setEditState(editstateGroup => ({
                                                                    ...editstateGroup,
                                                                    ..._editstateGroup
                                                                }));
                                                                updateGroup(group.id)
                                                                setGroupText('')
                                                            }
                                                        } style={
                                                            {
                                                                display: Boolean(editstateGroup[`key${group.id}`]) ? 'block' : 'none',
                                                                width: '28px',
                                                                height: '28px'
                                                            }
                                                        }>
                                                            <CheckIcon fontSize="inherit" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" size="small" onClick={() => deleteGroup(group.id)}>
                                                            <DeleteIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                                <IconButton aria-label="edit" size="small" onClick={
                                                    () => {
                                                        let _editstateGroup = editstateGroup;
                                                        _editstateGroup[`key${group.id}`] = editstateGroup[`key${group.id}`] ? !editstateGroup[`key${group.id}`] : true;
                                                        for (const [key, value] of Object.entries(_editstateGroup)) {
                                                            if (key != `key${group.id}`) {
                                                                _editstateGroup[key] = false;
                                                            }
                                                        }
                                                        setEditStateGroup(editstateGroup => ({
                                                            ...editstateGroup,
                                                            ..._editstateGroup
                                                        }));
                                                        setGroupText(group.name)
                                                        setColor(group.color)
                                                    }
                                                } style={
                                                    {
                                                        display: !Boolean(editstateGroup[`key${group.id}`]) ? 'block' : 'none',
                                                        width: '28px',
                                                        height: '28px'
                                                    }
                                                }>
                                                    <DisplaySettingsIcon fontSize="inherit" />
                                                </IconButton>
                                            </Stack>
                                        </div>
                                        <Droppable droppableId={`droppable-${group.id}`} key={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                    {...provided.droppableProps}
                                                >
                                                    {group.todo_lists.map((item, _index) => (
                                                        <Draggable key={`item${group.id}-${item.id}`} draggableId={`item${group.id}-${item.id}`} index={_index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={getItemStyle(
                                                                        snapshot.isDragging,
                                                                        provided.draggableProps.style
                                                                    )}
                                                                >
                                                                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems={'center'}>
                                                                        <IconButton aria-label="delete" onClick={() => { updateTodoStatus(item.id) }} size="small">
                                                                            <CheckCircleIcon fontSize="inherit" color={item.status ? 'success' : ''} />
                                                                        </IconButton>
                                                                        <span style={{
                                                                            width: '100%',
                                                                            display: !Boolean(editstate[`key${item.id}`]) ? 'block' : 'none'
                                                                        }}>{item.name}</span>
                                                                        <TextField value={name} multiline style={
                                                                            {
                                                                                display: Boolean(editstate[`key${item.id}`]) ? 'block' : 'none'
                                                                            }
                                                                        } onChange={
                                                                            (e) => {
                                                                                setName(e.target.value)
                                                                            }
                                                                        } />
                                                                        <IconButton aria-label="edit" size="small" onClick={
                                                                            () => {
                                                                                let _editstate = editstate;
                                                                                _editstate[`key${item.id}`] = expanded[`key${item.id}`] ? !expanded[`key${item.id}`] : true;
                                                                                for (const [key, value] of Object.entries(_editstate)) {
                                                                                    if (key != `key${item.id}`) {
                                                                                        _editstate[key] = false;
                                                                                    }
                                                                                }
                                                                                setEditState(editstate => ({
                                                                                    ...editstate,
                                                                                    ..._editstate
                                                                                }));
                                                                                setName(item.name)
                                                                            }
                                                                        } style={
                                                                            {
                                                                                display: !Boolean(editstate[`key${item.id}`]) ? 'block' : 'none',
                                                                                width: '28px',
                                                                                height: '28px'
                                                                            }
                                                                        }>
                                                                            <EditIcon fontSize="inherit" />
                                                                        </IconButton>
                                                                        <IconButton aria-label="edit" size="small" onClick={
                                                                            () => {
                                                                                let _editstate = editstate;
                                                                                for (const [key, value] of Object.entries(_editstate)) {
                                                                                    _editstate[key] = false;
                                                                                }
                                                                                setEditState(editstate => ({
                                                                                    ...editstate,
                                                                                    ..._editstate
                                                                                }));
                                                                                updateTodo(item.id)
                                                                                setName('')
                                                                            }
                                                                        } style={
                                                                            {
                                                                                display: Boolean(editstate[`key${item.id}`]) ? 'block' : 'none',
                                                                                width: '28px',
                                                                                height: '28px'
                                                                            }
                                                                        }>
                                                                            <CheckIcon fontSize="inherit" />
                                                                        </IconButton>
                                                                        <IconButton aria-label="delete" onClick={() => deleteTodo(item.id)} size="small">
                                                                            <DeleteIcon fontSize="inherit" />
                                                                        </IconButton>
                                                                    </Stack>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                        <div className={styles.footer_list}>
                                            <Button startIcon={<AddIcon />} color="primary" onClick={
                                                () => {
                                                    let _expanded = expanded;
                                                    _expanded[`key${index}`] = expanded[`key${index}`] ? !expanded[`key${index}`] : true;
                                                    for (const [key, value] of Object.entries(_expanded)) {
                                                        if (key != `key${index}`) {
                                                            _expanded[key] = false;
                                                        }
                                                    }
                                                    setExpanded(expanded => ({
                                                        ...expanded,
                                                        ..._expanded
                                                    }));
                                                    setGroupId(group.id);
                                                    setTodo('');
                                                }
                                            }>Add a card</Button>
                                            <Collapse in={Boolean(expanded[`key${index}`])} timeout="auto" unmountOnExit>
                                                <Stack direction="column" spacing={1}>
                                                    <TextField value={todo} onChange={
                                                        (e) => {
                                                            setTodo(e.target.value);
                                                        }
                                                    } />
                                                    <Button variant="outlined" color="primary" onClick={createTodo}>เพิ่ม Todo</Button>
                                                </Stack>
                                            </Collapse>
                                        </div>
                                    </div>
                                )
                            })}
                            <div style={
                                {
                                    minWidth: '250px',
                                    paddingRight: '20px'
                                }
                            }>
                                <Stack direction="column" spacing={1}>
                                    <TextField value={groupName} onChange={
                                        (e) => {
                                            setGroupName(e.target.value);
                                        }
                                    } />
                                    <Button variant="outlined" startIcon={<AddIcon />} color="primary" onClick={createGroup} >เพิ่ม Todo list</Button>
                                </Stack>
                            </div>
                        </Stack>
                    </DragDropContext>
                </NoSsr>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const userId = context.query.userId !== undefined ? context.query.userId : process.env.NEXT_PUBLIC_USER;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/getall`, {
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

export default Todo;