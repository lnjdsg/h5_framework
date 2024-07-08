import { useEffect ,useRef,useCallback} from 'react'
export {
    useDebounce,
    useThrottle
}
//防抖
function useDebounce(fn, delay, dep = []) {
    useEffect(() => {
        let timer;
        timer = setTimeout(fn, delay);
        return () => clearTimeout(timer); 
    }, [...dep]
    )
}
//节流
function useThrottle(fn, delay, dep = []) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
        current.fn = fn;
    }, [fn]);

    return useCallback(function f(...args) {
        if (!current.timer) {
            current.timer = setTimeout(() => {
                delete current.timer;
            }, delay);
            current.fn.call(this, ...args);
        }
    }, dep);
}

