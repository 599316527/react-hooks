import {useKeyPressing} from '@huse/document-event';

const items = Array.from({length: 10}, (_, i) => String.fromCodePoint('😀'.codePointAt(0) + i));

export default function Demo() {

    const {Alt: reversed} = useKeyPressing(['Alt']);

    let realItems = items;
    if (reversed) {
        realItems = realItems.slice().reverse();
    }

    return (
        <>
            <div style={{textAlign: 'center', fontSize: '2em'}}>
                {realItems.join(' ')}
            </div>
            <div>Pressing <kbd>Alt</kbd> to reverse emojis.</div>
        </>
    );
}
