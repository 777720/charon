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

        let cr = Charon.init('#app');
        let circle1 =  new Charon.Circle({
            shape: {
                cx: 40,
                cy: 40,
                r: 20
            }
        })
        let circle2 =  new Charon.Circle({
            shape: {
                cx: 80,
                cy: 80,
                r: 10
            }
        })

        let rect1 = new Charon.Rect({
            shape: {
                width: 200,
                height: 50,
                rx: 12,
                ry: 12
            }
        })
        let rect2 = new Charon.Rect({
            shape: {
                width: 100,
                height: 50,
                rx: 55,
                ry: 55
            }
        })
        cr.add(circle1, circle2, rect1, rect2);

        // let canvas = document.querySelector('#canvas');
        // let ctx = canvas.getContext('2d');
        // circle.refresh(ctx)
    }
}
</script>
