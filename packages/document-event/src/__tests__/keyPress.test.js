/* eslint-disable no-empty-function, react/jsx-no-bind */
import {render, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useKeyPress, useKeyPressing} from '../index';
import {mockPlatform, clearMockPlatform} from './mock';

function Foo({onPressed}) {
    useKeyPress('Ctrl+C', onPressed);
    useKeyPress({'command + V': onPressed, 'ctrl+shift+z': onPressed});
    useKeyPress({'ctrl+alt+shift+a': onPressed}, {fromTextarea: true});
    useKeyPress('meta + b', onPressed);
    return (
        <div id="container">
            <textarea id="textarea" />
        </div>
    );
}

function getHandler() {
    const data = {events: []};
    function onPressed(e) {
        data.events.push([e.key, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey]);
    }
    function getEvents() {
        return data.events;
    }
    function clearEvents() {
        data.events = [];
    }
    return {onPressed, getEvents, clearEvents};
}

test('trigger key combination', () => {
    const {onPressed, getEvents} = getHandler();
    const {baseElement} = render(<Foo onPressed={onPressed} />);
    userEvent.click(baseElement);
    userEvent.keyboard('{ctrl}c{/ctrl}');
    userEvent.keyboard('abc');
    userEvent.keyboard('{ctrl}{shift}{alt}z{/shift}{/alt}{/ctrl}');
    userEvent.keyboard('{meta}b{/meta}');
    expect(getEvents()).toEqual([
        ['c', true, false, false, false],
        ['z', true, true, true, false],
        ['b', false, false, false, true],
    ]);
});

test('trigger command key', () => {
    const {onPressed, getEvents, clearEvents} = getHandler();
    const {baseElement} = render(<Foo onPressed={onPressed} />);
    userEvent.click(baseElement);
    userEvent.keyboard('v', {keyboardState: userEvent.keyboard('[ControlLeft>]')});
    userEvent.keyboard('v', {keyboardState: userEvent.keyboard('[MetaLeft>]')});
    expect(getEvents()).toEqual([
        ['v', true, false, false, false],
    ]);

    clearEvents();
    mockPlatform('MacIntel');
    userEvent.keyboard('v', {keyboardState: userEvent.keyboard('[ControlLeft>]')});
    userEvent.keyboard('v', {keyboardState: userEvent.keyboard('[MetaLeft>]')});
    expect(getEvents()).toEqual([
        ['v', false, false, false, true],
    ]);
    clearMockPlatform();
});

test('trigger event from textarea', () => {
    const {onPressed, getEvents} = getHandler();
    const {container} = render(<Foo onPressed={onPressed} />);
    const textarea = container.querySelector('#textarea');
    userEvent.type(textarea, 'ab{ctrl}c</ctrl}{ctrl}{shift}{alt}a{/shift}{/alt}{/ctrl}d');
    expect(textarea.value).toBe('abd');
    expect(getEvents()).toEqual([
        ['a', true, true, true, false],
    ]);
});


function Bar({keys}) {
    const pressing = useKeyPressing(keys, {});
    let value = 0;
    if (pressing.Alt) {
        value++;
    }
    if (pressing.Shift) {
        value++;
    }
    return <div id="value">{value}</div>;
}

test('trigger key pressing', () => {
    const {container} = render(<Bar keys={['Alt', 'Shift']} />);
    const el = container.querySelector('#value');
    expect(el.innerHTML).toBe('0');
    fireEvent.keyDown(el, {key: 'Alt'});
    expect(el.innerHTML).toBe('1');
    fireEvent.keyDown(el, {key: 'Shift'});
    fireEvent.keyDown(el, {key: 'a'});
    expect(el.innerHTML).toBe('2');
    fireEvent.keyUp(el, {key: 'a'});
    fireEvent.keyUp(el, {key: 'Shift'});
    expect(el.innerHTML).toBe('1');
    fireEvent.keyUp(el, {key: 'Alt'});
    expect(el.innerHTML).toBe('0');
});
