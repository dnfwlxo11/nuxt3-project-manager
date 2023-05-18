<template>
	<div class="resize-content" ref="resizeComponent">
		<slot />
		<div id="heightBar" class="height-resize-bar" ref="heightBar">
			<img src="/assets/icons/height-resize.svg">
		</div>
		<div id="widthBar" class="width-resize-bar" ref="widthBar">
			<img src="/assets/icons/width-resize.svg">
		</div>
		<div id="hwBar" class="hw-resize-bar" ref="hwBar">
			<img src="/assets/icons/hw-resize.svg">
		</div>
	</div>
</template>

<script setup>
const $props = defineProps({
	width: {
		type: Number,
		default: 0,
	},
	height: {
		type: Number,
		default: 0,
	},
	zoomPercentage: {
		type: Number,
		default: 1.0,
	},
})

const { width: p_width, height: p_height, zoomPercentage: p_zoomPercentage } = toRefs($props)
const resizeComponent = ref()
const heightBar = ref()
const widthBar = ref()
const hwBar = ref()

const _zoomPercentage = ref(1.0)
const _targetWidth = ref(0)
const _targetHeight = ref(0)
const _bufWidth = ref(0)
const _bufHeight = ref(0)
const _isResize = ref(0)

const emit = defineEmits([
	'update:pos'
])

onMounted(() => {
	resizeComponent.value.width = p_width.value
	resizeComponent.value.height = p_height.value

	heightBar.value.addEventListener('mousedown', h_mouseDownHandler)
	widthBar.value.addEventListener('mousedown', h_mouseDownHandler)
	hwBar.value.addEventListener('mousedown', h_mouseDownHandler)

	resizeComponent.value.addEventListener('mouseup', h_mouseLeaveHandler)
	resizeComponent.value.parentNode.addEventListener('mouseup', h_mouseLeaveHandler)
	resizeComponent.value.parentNode.addEventListener('mouseleave', h_mouseLeaveHandler)
})

const h_heightResizeHandler = (evt) => {
	if (!_isResize.value) return

	const movedHeight = evt.clientY - _bufHeight.value 
	const newHeight = resizeComponent.value.clientHeight + movedHeight

	resizeComponent.value.style.height = `${newHeight}px`
	_targetHeight.value = newHeight

	_bufHeight.value = evt.clientY
}

const h_widthResizeHandler = (evt) => {
	if (!_isResize.value) return

	const movedWidth = evt.clientX - _bufWidth.value 
	const newWidth = resizeComponent.value.clientWidth + movedWidth

	resizeComponent.value.style.width = `${newWidth}px`
	_targetWidth.value = newWidth

	_bufWidth.value = evt.clientX
}

const h_hwResizeHandler = (evt) => {
	if (!_isResize.value) return

	const movedWidth = evt.clientX - _bufWidth.value 
	const movedHeight = evt.clientY - _bufHeight.value 
	const newWidth = resizeComponent.value.clientWidth + movedWidth
	const newHeight = resizeComponent.value.clientHeight + movedHeight

	resizeComponent.value.style.width = `${newWidth}px`
	resizeComponent.value.style.height = `${newHeight}px`
	_targetWidth.value = newWidth
	_targetHeight.value = newHeight
	
	_bufWidth.value = evt.clientX
	_bufHeight.value = evt.clientY

}

const h_mouseDownHandler = (evt) => {
	evt.stopPropagation()
	_isResize.value = true

	_bufWidth.value = evt.clientX
	_bufHeight.value = evt.clientY

	document.body.style.userSelect = "none"

	if (evt.target.id === 'heightBar') heightBar.value.addEventListener('mousemove', h_heightResizeHandler)
	else if (evt.target.id === 'widthBar') widthBar.value.addEventListener('mousemove', h_widthResizeHandler)
	else hwBar.value.addEventListener('mousemove', h_hwResizeHandler)
}

const h_mouseLeaveHandler = (evt) => {
	_isResize.value = false

	document.body.style.userSelect = "initial"

	heightBar.value.removeEventListener('mousemove', h_mouseDownHandler)
	widthBar.value.removeEventListener('mousemove', h_mouseDownHandler)
	hwBar.value.removeEventListener('mousemove', h_mouseDownHandler)

	emit('update:pos', { 
		width: resizeComponent.value.clientWidth,
		height: resizeComponent.value.clientHeight,
		zoomPercentage: _zoomPercentage.value,
	})
}

watch([p_width, p_height], ([width, height]) => {
	_targetWidth.value = width
	_targetHeight.value = height
}, { immediate: true })

watch((p_zoomPercentage), (zoom) => {
	_zoomPercentage.value = zoom
}, { immediate: true })
</script>

<style lang="scss">
.resize-content {
	position: absolute;
	border: 1px solid lightgray;
	height: v-bind('_targetHeight + "px"');
	width: v-bind('_targetWidth + "px"');

	transform-origin: 0 0;
	transform: scale(v-bind('_zoomPercentage'));

	.height-resize-bar,
	.width-resize-bar,
	.hw-resize-bar {
		position: absolute;
		background-color: #E1E3E5;

		&:hover {
			background-color: lightgray;
		}

		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 15px;
			height: 15px;
		}
	}

	.height-resize-bar {
		left: -1px;
		top: v-bind('_targetHeight + "px"');
		height: 30px;
		width: v-bind('_targetWidth + "px"');

		&:hover {
			cursor: ns-resize;
		}
	}

	.width-resize-bar {
		top: -1px;
		left: v-bind('_targetWidth + "px"');
		height: v-bind('_targetHeight + "px"');
		width: 30px;
		
		&:hover {
			cursor: ew-resize;
		}
	}

	.hw-resize-bar {
		top: v-bind('_targetHeight + "px"');
		left: v-bind('_targetWidth + "px"');
		width: 30px;
		height: 30px;
		
		&:hover {
			cursor: nwse-resize;
		}
	}
}
</style>