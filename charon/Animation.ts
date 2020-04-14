import {clone, isFunction, isObject} from "./utils";
import EasingFuns, {EasingFn, EasingFnType} from './Easing';

interface KeyFrameInQuene {
    time: number,
    value: number
}

function getNestedValue(
    preValue: any,
    nextValue: any,
    currentTime: number,
    duringTime: number,
    easingFn: EasingFn
) {
    let value;
    // 假定前后两次值的类型相同
    if (isObject(nextValue)) {
        value = {};
        for (let key in nextValue) {
            value[key] = getNestedValue(preValue[key], nextValue[key], currentTime, duringTime, easingFn);
        }
    } else if (Array.isArray(nextValue)) {
        value = []
        for (let i = 0; i < nextValue.length; i += 1) {
            value[i] = getNestedValue(preValue[i], nextValue[i], currentTime, duringTime, easingFn)
        }
    } else {
        value = easingFn(
            currentTime,
            preValue,
            nextValue - preValue,
            duringTime
        );
    }

    return value;
}

function getCurrentValue(
    queue: KeyFrameInQuene[],
    deltaTime: number,
    easingFn: EasingFn
) {
    let preFrame: KeyFrameInQuene;
    let nextFram: KeyFrameInQuene;
    preFrame = {
        time: 0,
        value: 0
    };
    nextFram = {
        time: 0,
        value: 0
    };
    for (let i = 0; i < queue.length; i += 1) {
        let frame = queue[i];
        // 已经是最后一帧了，还没有找到前一帧，说明时间已经超过最长关键帧的时间了
        // 假定最少有两个关键帧
        if (i === queue.length - 1) {
            preFrame = queue[i - 1];
            nextFram = frame;
        } else if (frame.time < deltaTime && (queue[i + 1].time >= deltaTime)) {
            preFrame = frame;
            nextFram = queue[i + 1];
            break;
        }
    }
    let lastFram = queue[queue.length - 1];
    deltaTime = deltaTime > lastFram.time ? lastFram.time : deltaTime;
    let value = getNestedValue(
        preFrame.value,
        nextFram.value,
        deltaTime - preFrame.time,
        nextFram.time - preFrame.time,
        easingFn
    );

    return value;
}


export default class Animation {
    private _target: object = {};
    private _keyFrameQueue: {
        [prop: string]: KeyFrameInQuene[]
    } = {};

    private _maxTime = 0;
    private _duringQueue: ((target: object) => void)[] = [];
    private _doneQueue: ((target: object) => void)[] = [];
    private _delay = 0;
    public startTime = 0;
    private _easingFn: EasingFn = EasingFuns.linear;

    private _paused = false;

    private _pausedTime = 0;

    private _runing = false;

    constructor(target: object) {
        this._target = clone(target);
    }


    resetStatus() {
        // 重置开始时间
        this.startTime = 0;
    }


    start(easingFn: EasingFnType | EasingFn) {
        let fn = () => {
            this.startTime = Date.now();
            requestAnimationFrame(this.update);
        };
        if (this._delay > 0) {
            setTimeout(fn, this._delay);
        } else {
            fn();
        }

        return this;
    }

    update = () => {
        let nowTime = Date.now();
        let deltaTime = nowTime - this.startTime;

        for (let key in this._keyFrameQueue) {
            let keyQueue = this._keyFrameQueue[key];
            this._target[key] = getCurrentValue(keyQueue, deltaTime, this._easingFn);
        }

        this._duringQueue.forEach(fn => {
            fn(this._target);
        });
        if (deltaTime >= this._maxTime) {
            this._doneQueue.forEach(fn => {
                fn(this._target);
            });
        } else {
            requestAnimationFrame(this.update);
        }

    };

    during(callback: (target: object) => void) {
        if (!isFunction(callback)) {
            return this;
        }
        this._duringQueue.push(callback);
        return this;
    }

    done(callback: (target: object) => void) {
        if (!isFunction(callback)) {
            return this;
        }
        this._doneQueue.push(callback);
    }

    delay(delay: number) {
        this._delay = delay;
        return this;
    }


    /**
     * 设置关键帧
     * @param time 关键帧时间
     * @param animateObj 要动画的对象
     */
    when(time = 1000, animateObj = {}) {
        if (!animateObj || !isObject(animateObj)) {
            return;
        }
        let target = this._target;
        for (let key in animateObj) {
            if (!target[key]) {
                target[key] = 0;
            }
            let keyQueue = this._keyFrameQueue[key];
            if (!keyQueue) {
                keyQueue = this._keyFrameQueue[key] = [{
                    time: 0,
                    value: target[key]
                }];
            }
            let keyFrame = {
                time,
                value: animateObj[key]

            };
            for (let i = (keyQueue.length - 1); i >= 0; i -= 1) {
                if (keyQueue[i].time < time) {
                    keyQueue.splice(i + 1, 0, keyFrame);
                    break;
                }
                if (keyQueue[i].time === time) {
                    keyQueue.splice(i, 1, keyFrame);
                    break;
                }
            }
            if (time > this._maxTime) {
                this._maxTime = time;
            }
        }
        return this;
    }

    /**
     * 清除所有动画及队列
     */
    clear() {
        this._maxTime = 0;
        this._doneQueue = [];
        this._delay = 0;
        this._duringQueue = [];
        this._keyFrameQueue = {};
    }

    /**
     * 停止动画
     */
    stop() {
        this._runing = false;
    }

    /**
     * 暂停动画
     */
    pause() {
        this._pausedTime = Date.now();
        this._paused = true;
    }

    /**
     * 恢复暂停的动画
     */
    resume() {
        if (!this._paused) {
            return;
        }
        this._paused = false;
        this.startTime += (Date.now() - this._pausedTime);
        requestAnimationFrame(this.update);
    }


}
