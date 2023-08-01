import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
const Unsplash = () => {
    const [img, setImg] = useState("");
    const [res, setRes] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const API_KEY = "Sgv-wti48nSLfRjYsH7lmH_8N3wjzC18ccTYFxBzxmw";
    const fetchRequest = async () => {
        const data = await fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${img}&client_id=${API_KEY}`
        );
        const dataJ = await data.json();
        const result = dataJ.results;
        console.log(result);
        setRes(result);
    };
    useEffect(() => {
        fetchRequest();
    }, []);
    const Submit = () => {
        fetchRequest();
        setImg("");
    };

    return (
        <>
            <input
                className=" form-control-sm py-1 fs-4 text-capitalize border border-3 border-dark"
                type="text" placeholder="Search Anything..." value={img}
                onChange={(e) => setImg(e.target.value)}
            />
            <button
                type="submit"
                onClick={Submit}
                className="btn bg-dark text-white fs-3 mx-3"
            >
                Search
            </button>

            <div className="grid grid-cols-12 ">
                {res.map((val) => {
                    return (
                        <div key={val.id} className='col-span-3' onClick={() => setSelectedImage(val.urls.small)}>
                            <img
                                className="img-fluid img-thumbnail"
                                src={val.urls.small}
                                alt={val.alt_description}
                            />
                        </div>
                    );
                })}
                {selectedImage && (
                    <div>
                        <h3>Selected Image:</h3>
                        <img src={selectedImage} alt="Selected" />
                    </div>
                )}
            </div>
        </>
    )
}

export default Unsplash