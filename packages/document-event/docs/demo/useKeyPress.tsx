import {useState} from 'react';
import {useKeyPress} from '@huse/document-event';
import {useToggle} from '@huse/boolean';

const items = Array.from({length: 10}, (_, i) => String.fromCodePoint('😀'.codePointAt(0) + i));

export default function Demo() {
    const [reversed, toggleReversed] = useToggle(false);
    const [index, setIndex] = useState(items.length);
    useKeyPress({
        'Command + Z': () => setIndex(i => Math.max(1, i - 1)),
        'Command + Shift + Z': () => setIndex(i => Math.min(items.length, i + 1)),
    });
    useKeyPress('Command + R', evt => {
        evt.preventDefault();
        toggleReversed();
    });

    let realItems = items.slice(0, index);
    if (reversed) {
        realItems = realItems.reverse();
    }

    return (
        <>
            <div style={{textAlign: 'center', fontSize: '2em'}}>
                {realItems.join(' ')}
            </div>
            <ul>
                <li>Windows: <kbd>Ctrl+Z</kbd>, <kbd>Ctrl+Shift+Z</kbd>, <kbd>Ctrl+R</kbd></li>
                <li>Mac: <kbd>⌘Z</kbd>, <kbd>⇧⌘Z</kbd>, <kbd>⌘R</kbd></li>
            </ul>
        </>
    );
}
