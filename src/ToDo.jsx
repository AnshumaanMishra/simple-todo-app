import React from 'react';
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

function inList(list, item) {
    for (var i = 0; i < list.length; i++) {
        if (item == list[i]) {
            return true;
        }
    }
    return false;
}

function fininlist(list, item) {
    for (var i = 0; i < list.length; i++) {
        if (item == list[i]) {
            return i;
        }
    }
    return -1;
}

function getSpliced(list, task) {
    var temp = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] != task) {
            temp.push(list[i]);
        }
    }
    return temp;
}

function ToDo() {
    const [incomplete, setInComplete] = useState([]);
    const [complete, setComplete] = useState([]);

    const [loaded, setLoaded] = useState(false);
    
  useEffect(() => {
    const loadCookieData = (name, setter) => {
        const cookieValue = Cookies.get(name);

        if (cookieValue) {
            try {
            const parsed = JSON.parse(cookieValue);
            if (Array.isArray(parsed)) {
                setter(parsed);
            } else {
                console.warn(`${name} cookie is not an array, resetting...`);
                Cookies.set(name, JSON.stringify([]), { expires: 7 });
                setter([]);
            }
            } catch (e) {
            console.error(`Failed to parse ${name} cookie:`, e);
            Cookies.set(name, JSON.stringify([]), { expires: 30});
            setter([]);
            }
        } else {
            Cookies.set(name, JSON.stringify([]), { expires: 30});
            setter([]);
        }
    };

    loadCookieData('complete', setComplete);
    loadCookieData('incomplete', setInComplete);

    setLoaded(true);
    }, []);
    var buffer;

    useEffect(() => {
        if (loaded) {
            Cookies.set('complete', JSON.stringify(complete), { expires: 30 });
        }
    }, [complete, loaded]);

    useEffect(() => {
        if (loaded) {
            Cookies.set('incomplete', JSON.stringify(incomplete), { expires: 30 });
        }
    }, [incomplete, loaded]);


    function bufferElement(event) {
        buffer = event.currentTarget.innerText;
    }

    function unbufferElement() {
        buffer = '';
    }

    function droppedIncomplete() {
        var findResult = fininlist(incomplete, buffer);
        if (findResult == -1) {
            setInComplete([buffer].concat(incomplete));
            setComplete(getSpliced(complete, buffer))
        }
        unbufferElement();
    }

    function droppedComplete() {
        var findResult = fininlist(complete, buffer);
        if (findResult == -1) {
            setComplete([buffer].concat(complete));
            setInComplete(getSpliced(incomplete, buffer))
        }
        unbufferElement();
    }

    function onDragOver(event) {
        event.preventDefault();
    }

    function addTask() {
        var val = document.getElementById("task-getter").value;
        var check = inList(incomplete, val);
        if (!check && val != '') {
            setInComplete([val].concat(incomplete));
            if (inList(complete, val)) {
                deleteFromComplete(val)
            }
        }
        document.getElementById("task-getter").value = '';
    }

    function keyLod(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    }

    function clearincomplete() {
        setInComplete([]);
    }

    function clearcomplete() {
        setComplete([]);
    }

    function completeTask(task) {
        var findResult = fininlist(incomplete, task);
        if (findResult >= 0) {
            setComplete([task].concat(complete));
            setInComplete(getSpliced(incomplete, task))
        }

        var findResult = fininlist(complete, task);
        if (findResult >= 0) {
            setInComplete([task].concat(incomplete));
            setComplete(getSpliced(complete, task));
        }

    }

    function deleteFromComplete(task) {
        setComplete(getSpliced(complete, task));
    }

    function deleteFromIncomplete(task) {
        setInComplete(getSpliced(incomplete, task));
    }
 
    return (
        <>
            <h1>Simple To-Do App</h1>
            <div className="text-box">
                <input type="text" placeholder='Enter task' onKeyDown={keyLod} id='task-getter' />
                <button onClick={addTask}>
                    +
                </button>
            </div>
            <div className="tasks-view">
                <div className="incomplete"
                    onDragOver={(event) => onDragOver(event)}
                    onDrop={(event) => droppedIncomplete()}
                >
                    <div className="title">
                        <h2>Incomplete Tasks</h2>
                        <button onClick={clearincomplete}>Clear</button>
                    </div>
                    <ul
                    >
                        {
                            incomplete.map(todo => {
                                return (
                                    <li
                                        key={todo}
                                        className='list-item'
                                        draggable="true"
                                        onDragStart={(event) => bufferElement(event)}
                                    >
                                        {todo}
                                        <img
                                            src="/src/assets/tick.png"
                                            alt=""
                                            className='tick-mark'
                                            onClick={() => {
                                                completeTask(todo);
                                            }}
                                        />
                                        <img
                                            src="/src/assets/delete.svg"
                                            alt=""
                                            className='delete'
                                            onClick={() => {
                                                deleteFromIncomplete(todo);
                                            }}
                                        />
                                    </li>
                                )
                            }
                            )
                        }
                    </ul>

                </div>
                <div className="complete"
                    onDragOver={(event) => onDragOver(event)}
                    onDrop={(event) => droppedComplete()}
                >
                    <div className="title">
                        <h2>Complete Tasks</h2>
                        <button onClick={clearcomplete}>Clear</button>
                    </div>
                    <ul>
                        {complete.map(todo => {
                            return (
                                <li
                                    key={todo}
                                    className='list-item'
                                    draggable="true"
                                    onDragStart={(event) => bufferElement(event)}
                                >
                                    {todo}
                                    <img
                                        src="/src/assets/cross.png"
                                        alt=""
                                        className='tick-mark'
                                        onClick={() => {
                                            completeTask(todo);
                                        }}
                                    />
                                    <img
                                        src="/src/assets/delete.svg"
                                        alt=""
                                        className='delete'
                                        onClick={() => {
                                            deleteFromComplete(todo)
                                        }}
                                    />
                                </li>)
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ToDo;