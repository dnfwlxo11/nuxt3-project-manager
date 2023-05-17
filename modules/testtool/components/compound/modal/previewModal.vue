<template>
	<div class="modal">
		<div class="modal-wrapper" @click="exitAction"></div>
		<div class="modal-content">
			<div class="preview-component">
				<div class="preview-menu">
					<div v-if="_currentDevice" class="device-menu">
						Dimension:&nbsp;&nbsp;<span class="device-more" @click="_showDevices = !_showDevices">
							{{ _currentDevice.name }} <img src="/assets/icons/more-arrow.svg">
						</span>
						<div v-if="_showDevices" class="devices">
							<div class="device" :class="{ 'active': 'Responsive' === _currentDevice.name }"
								@click="_currentDevice = _defaultResponsive; _showDevices = false">
								Responsive
							</div>
							<hr>
							<div class="device" v-for="( item, idx ) of  devices " :key=" idx "
								:class=" { 'active': item.name === _currentDevice.name } "
								@click=" _currentDevice = item; _showDevices = false ">
								{{ item.name }}
							</div>
						</div>
            <div class="device" v-else>
              @{{ _currentDevice.name.charAt(0).toUpperCase() + _currentDevice.name.slice(1) }}
            </div>
						<div class="badge">
							<input type="number" v-model=" _currentDevice.width " :disabled=" _currentDevice.name !== 'Responsive' ">
						</div>
						<img src="/assets/icons/multiply.svg" alt="">
						<div class="badge">
							<input type="number" v-model=" _currentDevice.height " :disabled=" _currentDevice.name !== 'Responsive' ">
						</div>
					</div>
					<div class="zoom">
						<img src="/assets/icons/magnify-minus.svg" @click=" f_zoomOut ">
						<div class="badge">
							<div class="zoom-percentage">{{ (_zoomPercentage * 100).toFixed(0) }}%</div>
						</div>
						<img src="/assets/icons/magnify-plus.svg" @click=" f_zoomIn ">
					</div>
					<div class="close" @click="exitAction">
						<img src="/assets/icons/close.svg">
					</div>
				</div>
				<div class="preview-content" ref="previewContentRef">
					<div class="preview-inner" ref="previewContentInnerRef">
						<slot />
					</div>
          <div class="height-resize-bar"></div>
          <div class="width-resize-bar"></div>
          <div class="hw-resize-bar"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const $props = defineProps({
	device: {
		type: Object,
		default: () => { return {} },
	}
})

const { device: p_device } = toRefs($props)

const _currentDevice = ref()
const _showDevices = ref(false)
const _zoomPercentage = ref(1.0)
const previewContentRef = ref()
const previewContentInnerRef = ref()
const _defaultResponsive = ref({ name: 'Responsive', width: 1024, height: 720 })

const devices = ref([
	{ name: 'iPhone SE', width: 375, height: 667 },
	{ name: 'iPad Air', width: 820, height: 1180 },
	{ name: 'iPad Mini', width: 768, height: 1024 },
	{ name: 'Surface Pro 7', width: 1368, height: 912 },
	{ name: 'Galaxy Fold', width: 280, height: 653 },
	{ name: 'Galaxy S8+', width: 360, height: 740 },
])

const emit = defineEmits([
	'modal:close'
])

const f_zoomIn = () => {
	if (_zoomPercentage.value >= 10.0) return

	if (_zoomPercentage.value < 0.1) _zoomPercentage.value += 0.01
	else if (_zoomPercentage.value < 1.0) _zoomPercentage.value += 0.1
	else if (_zoomPercentage.value >= 1.0 && _zoomPercentage.value < 10.0) _zoomPercentage.value += 0.5
	else _zoomPercentage.value += 1.0

	_zoomPercentage.value = Number(_zoomPercentage.value.toFixed(3))
}

const f_zoomOut = () => {
	if (_zoomPercentage.value <= 0.01) return

	if (_zoomPercentage.value <= 0.1) _zoomPercentage.value -= 0.01
	else if (_zoomPercentage.value <= 1.0) _zoomPercentage.value -= 0.1
	else if (_zoomPercentage.value > 1.0 && _zoomPercentage.value < 10.0) _zoomPercentage.value -= 0.5
	else _zoomPercentage.value -= 1.0

	_zoomPercentage.value = Number(_zoomPercentage.value.toFixed(3))
}

const exitAction = () => {
  emit('modal:close', _currentDevice.value)
}

watch(p_device, (newVal) => {
  _currentDevice.value = newVal
}, { immediate: true })
</script>

<style lang="scss" scoped>
.modal {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 3;

	.modal-wrapper {
		position: absolute;
		height: 100vh;
		width: 100vw;
	}

	.modal-content {
		width: 95%;
		height: 95%;
		background-color: #F8F9FB;
		position: absolute;
		border-radius: 4px 4px 0px 0px;
		border: 0.5px solid #636A79;

		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.preview-component {
			background-color: #FFFFFF;
			border-radius: 4px 4px 0px 0px;
			height: 100%;

			.badge {
				display: flex;
				justify-content: center;
				align-items: center;
				margin: auto 5px auto 5px;
				padding: 2px 5px;
				height: 20px;
				font-size: 14px;
				border-radius: 18px;
				background-color: #ECEDEF;
				color: #636A79;
			}

			.preview-menu {
				border-bottom: 1px solid #ECEDEF;
				height: 50px;
				display: flex;

				img {
					width: 16px;
					height: 16px;
					min-width: 16px;
					min-height: 16px;
				}

				.device-menu {
					display: flex;
					position: relative;
					align-items: center;
					margin: auto auto auto 10px;
					font-weight: 500;
					font-size: 13px;
					height: 20px;
					z-index: 2;
					color: #999EA9;

					.device-more {
						border: none;
						color: #999EA9;
						background-color: transparent;
						margin-right: 10px;

						&:hover {
							cursor: pointer;
						}

						img {
							width: 6px;
							height: 6px;
							min-width: 10px;
							min-height: 10px;
						}
					}

					.devices {
						position: absolute;
						// background-color: #ECEDEF;
						backdrop-filter: blur(30px);
						top: calc(50px - 15px);
						width: 120px;
						padding: 5px 10px;
						border: 1px solid #A0A5B1;
						border-radius: 5px;

						.device {
							margin: 5px 0;
							padding: 5px;
							font-weight: 600;

							&:hover {
								background-color: lightgray;
							}
						}
					}

					input {
						background-color: transparent;
						text-align: center;
						border: none;
						width: 50px;
						padding: 2px;
						color: #636A79;

						&:focus {
							outline: none;
							border: none;
						}
					}

					input[type="number"]::-webkit-outer-spin-button,
					input[type="number"]::-webkit-inner-spin-button {
						-webkit-appearance: none;
						margin: 0;
					}
				}

				.zoom {
					display: flex;
					align-items: center;
					margin: auto 20px auto auto;

					.zoom-percentage {
						padding: 0 10px;
					}

					img {
						color: #636A79;
						margin: 0 5px;
					}
				}

				.close {
					display: flex;
					align-items: center;
					margin: auto 20px auto 10px;

					img {
						color: #636A79;
					}
				}
			}

			.preview-content {
				height: calc(100% - 50px - 20px - 1px);
				padding: 10px;
				overflow: auto;
				position: relative;

				.preview-inner {
					position: absolute;
					border: 1px solid lightgray;
					height: v-bind('_currentDevice?.height + "px"');
					width: v-bind('_currentDevice?.width + "px"');

					transform-origin: 0 0;
					transform: scale(v-bind('_zoomPercentage'));
				}


        .height-resize-bar,
        .width-resize-bar,
        .hw-resize-bar {
          position: absolute;
          background-color: #E1E3E5;

          &:hover {
            background-color: lightgray;
          }
        }

        .height-resize-bar {
          left: 10px;
          top: v-bind('(_currentDevice?.height + 10) + "px"');
          height: 15px;
          width: v-bind('(_currentDevice?.width + 10) + "px"');
        }

        .width-resize-bar {
          top: 10px;
          left: v-bind('(_currentDevice?.width + 10) + "px"');
          height: v-bind('(_currentDevice?.height + 10) + "px"');
          width: 15px;
        }

        .hw-resize-bar {
          top: v-bind('(_currentDevice?.height + 10) + "px"');
          left: v-bind('(_currentDevice?.width + 10) + "px"');
          width: 15px;
          height: 15px;
        }
			}
		}
	}
}
</style>