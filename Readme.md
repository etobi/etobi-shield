## Setup DT

```
cat << EOF > ~/mygpio-overlay.dts
/dts-v1/;
/plugin/;

/ {
    compatible = "brcm,bcm2708";

    fragment@0 {
        target = <&gpio>;
        __overlay__ {
            pinctrl-names = "default";
            pinctrl-0 = <&my_pins>;

            my_pins: my_pins {
                brcm,pins = <23 22 24 25>;     /* gpio no. */
                brcm,function = <0 0 0 0>; /* 0:in, 1:out */
                brcm,pull = <2 2 2 2>;     /* 2:up 1:down 0:none */
            };
        };
    };
};
EOF
sudo dtc -@ -I dts -O dtb -o ~/mygpio-overlay.dtb ~/mygpio-overlay.dts
sudo cp ~/mygpio-overlay.dtb /root/overlay
sudo sh -c 'echo device_tree_overlay=overlays/mygpio-overlay.dtb >> /boot/config.txt'
```