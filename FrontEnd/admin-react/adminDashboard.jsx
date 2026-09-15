// Sidebar

import { useEffect, useState } from "react";

function Sidebar() {
    return <h1>Admin Sidebar</h1>
}

function Dashboard() {
    return <h1>Dashboard Overview</h1>
}


function SermonInfo({ sermon }) {

    return (
        <article>
            <h2>{sermon.title}</h2>
            <p>{sermon.speaker}</p>
            <span>{sermon.category}</span>
        </article>
    );
}



function SermonCounter() {
    const [count, setCount] = useState(0);

    return (
        <div className="display">
            <p>Total Sermons: {count}</p>
            <button onClick={() => setCount(count + 1)}>Add Sermon</button>
        </div>
    );
}

const SermonList = ({ sermons, setSermons }) => {

    const addSermon = () => {
        const newSermon = {
            id: 3,
            title: "Understanding Wisdom",
            speaker: "Bishop David Oyedepo",
            category: "Wisdom",
        }
        setSermons([...sermons, newSermon])
    }

    return (
        <>
            {sermons.map(sermon => (
                <SermonInfo key={sermon.id} sermon={sermon} />

            ))}

            <button onClick={addSermon}>Add Sermon</button>
        </>
    )

};

function App() {
    const [sermons, setSermons] = useState([
        {
            id: 1,
            title: "Walking in Faith",
            speaker: "Bishop David Oyedepo",
            category: "Faith"
        },
        {
            id: 2,
            title: "The Power of Prayer",
            speaker: "Pastor David",
            category: "Prayer"
        },
    ]);


    return (
        <>
            <Sidebar />
            <Dashboard />

            <SermonCounter />
            <SermonList
                sermons={sermons}
                setSermons={setSermons}
            />
        </>
    )

}