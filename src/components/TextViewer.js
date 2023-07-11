import React, { useEffect, useState } from 'react';

function TextViewer({ url }) {
    const [text, setText] = useState();
    useEffect(() => {
        if (url) {
            fetch(url)
                .then(response => response.text())
                .then(data => setText(data))
                .catch(error => console.log(error));
        }

    }, [])
    return (
        <div>
            {text &&
                <pre>
                    {text}
                </pre>}
        </div>
    )
}

export default TextViewer