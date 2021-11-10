import {isString} from 'lodash';
import {useRef, useLayoutEffect, useCallback, useMemo, useState} from 'react';

type EventNames = keyof DocumentEventMap;

type DocumentEventHandler<K extends EventNames> = (e: DocumentEventMap[K]) => any;

export function useDocumentEvent<K extends EventNames>(
    eventName: K,
    fn: DocumentEventHandler<K>,
    options?: boolean | AddEventListenerOptions
) {
    const handler = useRef(fn);
    useLayoutEffect(
        () => {
            handler.current = fn;
        },
        [fn]
    );
    useLayoutEffect(
        () => {
            const trigger: DocumentEventHandler<K> = e => handler.current(e);
            document.addEventListener(eventName, trigger, options);
            return () => document.removeEventListener(eventName, trigger, options);
        },
        [eventName, options]
    );
}

function parseBinding(binding: string) {
    const [key, ...modifierKeys] = binding.toLowerCase().split('+').map(s => s.trim()).reverse();
    const modifierFields = modifierKeys.map(getModifierField);
    const modifiers = ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'].map(key => modifierFields.includes(key));
    return {key, modifiers};
}

function parseKeyPressArgs(args) {
    const [bindingMap, options] = isString(args[0]) ? [{[args[0]]: args[1]}, args[2]] : args;
    const bindings = Object.entries(bindingMap)
        .map(([keyBinding, callback]) => ({...parseBinding(keyBinding), callback}));
    return [bindings, options ?? {}];
}

function getModifierField(key: string): string {
    const isMac = navigator.platform.includes('Mac');
    const keyToFieldMap = {
        'command': isMac ? 'metaKey' : 'ctrlKey',
        'ctrl': 'ctrlKey',
        'shift': 'shiftKey',
        'alt': 'altKey',
        'meta': 'metaKey',
        'option': 'altKey',
    };
    return keyToFieldMap[key];
}

function isInTextarea(target) {
    return target.closest('input, textarea, [contenteditable]');
}

type KeyboardEventNames = 'keydown' | 'keyup' | 'keypress';

interface UseKeyPressOptions<K extends KeyboardEventNames> {
    eventName?: K;
    fromTextarea?: boolean;
}
interface KeyBindingMap<K extends KeyboardEventNames> {
    [key: string]: DocumentEventHandler<K>;
}
type UseKeyPressArgs<K extends KeyboardEventNames>
    = [string, DocumentEventHandler<K>, UseKeyPressOptions<K>?]
        | [KeyBindingMap<K>, UseKeyPressOptions<K>?];

export function useKeyPress<K extends KeyboardEventNames>(...args: UseKeyPressArgs<K>) {
    const [bindings, {eventName = 'keydown', fromTextarea}] = useMemo(() => parseKeyPressArgs(args), args);
    const handler = useCallback(
        event => {
            if (!fromTextarea && isInTextarea(event.target)) {
                return;
            }
            const matchedBinding = bindings.find(({key, modifiers}) => {
                if (event.key.toLowerCase() !== key) {
                    return false;
                }
                return ['ctrlKey', 'shiftKey', 'altKey', 'metaKey']
                    .every((key, i) => event[key] === modifiers[i]);
            });
            if (matchedBinding) {
                matchedBinding.callback(event);
            }
        },
        [bindings, fromTextarea]
    );
    useDocumentEvent(eventName, handler);
}

interface UseKeyPressingOptions {
    fromTextarea?: boolean;
}

export function useKeyPressing(watchKeys: string[], options: UseKeyPressingOptions = {}) {
    const {fromTextarea} = options;
    const [keyPressingMap, setKeyPressingMap] = useState({});
    const [handleKeyDown, handleKeyUp] = useMemo(
        () => {
            function set(key, value) {
                setKeyPressingMap(prev => ({...prev, [key]: value}));
            }
            function check(event) {
                if (!watchKeys.includes(event.key)) {
                    return;
                }
                return (fromTextarea || !isInTextarea(event.target));
            }
            return [
                e => check(e) && set(e.key, true),
                e => check(e) && set(e.key, false),
            ];
        },
        [fromTextarea, watchKeys, setKeyPressingMap]
    );
    useDocumentEvent('keydown', handleKeyDown);
    useDocumentEvent('keyup', handleKeyUp);
    return keyPressingMap;
}
