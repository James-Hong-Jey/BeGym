# run from webcam
python .\detection_scripts\detect_from_webcam.py -m .\models\ssd_mobilenet_v2_320x320_coco17_tpu-8\saved_model -l .\data\mscoco_label_map.pbtxt

# run from images
python .\detection_scripts\detect_from_image.py -m .\models\ssd_mobilenet_v2_320x320_coco17_tpu-8\saved_model -l .\data\mscoco_label_map.pbtxt -i .\test_images

# Data labels
.\data\mscoco_label_map.pbtxt

# Installed models:
ssd_mobilenet_v2_320x320_coco17_tpu-8
faster_rcnn_resnet50_v1_640x640_coco17_tpu-8
ssd_resnet101_v1_fpn_640x640_coco17_tpu-8