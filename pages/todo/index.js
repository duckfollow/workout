import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/todo.module.css";
import React, { useState } from "react";
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

const Todo = ({ data, userId }) => {
    // fake data generator
    const getItems = (count, offset = 0) =>
        Array.from({ length: count }, (v, k) => k).map(k => ({
            id: `item-${k + offset}`,
            content: `item ${k + offset}`
        }));

    const [items, setItems] = useState(getItems(10));
    const [selected, setSelected] = useState(getItems(5, 10));
    const [groupName, setGroupName] = useState("");
    const [groupList, setGroupList] = useState(data);
    const [expanded, setExpanded] = useState({});
    const [groupId, setGroupId] = useState(0);
    const [todo, setTodo] = useState("");

    const id2List = {
        droppable: 'items',
        droppable2: 'selected'
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
        padding: grid * 2,
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
        width: 280
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
            readData();
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
            readData();
            resetAddTodo();
        }, (error) => {
            console.log(error);
        });
    }

    const updateTodo = (id, groupId, index) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/update`, {
            id: id,
            group: groupId,
            store: userId,
            index: index,
        }).then((response) => {
            // readData();
        }, (error) => {
            console.log(error);
        });
    }

    const updateTodoAll = (data) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/list/update/all`, data).then((response) => {
            // readData();
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
            readData();
        })
    }

    const deleteGroup = (id) => {
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/todo/group/delete`, {
            id: id,
        }).then((response) => {
            readData();
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
            <div style={
                {
                    minWidth: '100vw',
                    minHeight: '100vh',
                    overflowX: 'scroll',
                    padding: 20,
                }
            }>
                <h1>Todo</h1>
                <NoSsr>
                    <DragDropContext onDragEnd={onDragEndTest}>
                        <Stack direction="row" spacing={2}>

                            {groupList.data.map((group, index) => {
                                return (
                                    <div key={group.id}>
                                        <div className={styles.header_list}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems={'center'}>
                                                <span style={{
                                                    width: '100%',
                                                }}>{group.name}</span>
                                                <IconButton aria-label="delete" onClick={() => deleteGroup(group.id)}>
                                                    <DeleteIcon />
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
                                                                        <span style={{
                                                                            width: '100%',
                                                                        }}>{item.name}</span>
                                                                        <IconButton aria-label="edit" size="small">
                                                                            <EditIcon />
                                                                        </IconButton>
                                                                        <IconButton aria-label="delete" onClick={() => deleteTodo(item.id)} size="small">
                                                                            <DeleteIcon />
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
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
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