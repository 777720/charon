<template>
    <div id="app">
        <canvas id="canvas"></canvas>
    </div>
</template>
<script>
import  * as Charon from "../charon";

export default {
    data() {
        return {};
    },
    mounted() {

        let cr = Charon.init('#app', {
            height: 300,
            width: 400
        });
        let circle1 = new Charon.Circle({
            shape: {
                cx: 60,
                cy: 60,
                r: 20
            },
            style: {
                stroke: '#f00',
                lineWidth: 1
            }
        })

       //  cr.add(circle1)
        let rect = new Charon.Rect({
            shape: {
                rx: 120,
                ry: 120,
                width: 40,
                height: 40
            },
            style: {
                fill: 'transparent'
            },
            origin: [120, 120],
            rotation: 0.8
        })
        cr.add(rect)
    }
}
</script>
