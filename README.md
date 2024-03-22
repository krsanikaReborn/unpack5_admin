# unpack_admin







###  Docker 배포하기


- docker hub
    ```sh
    docker build -t dwkim80/b5selfie_admin:latest .
    docker push dwkim80/b5selfie_admin:latest 

    

    # usb 로 배포할때는 아래 참고
    docker save -o b5selfie.tar dwkim80/b5selfie_admin:latest
    scp -P2201 b5selfie_admin.tar root@192.168.0.10:/app/ 
    docker load -i b5selfie_admin.tar
    ```