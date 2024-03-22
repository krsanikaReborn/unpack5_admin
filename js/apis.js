const appendix = {    
    "quick" : "QUICK-SHOT",
    "highlow" : "FLEX-CAM",
    "high" : "HIGH",
    "low" : "LOW",
    switch : (text)=>{
        return appendix[text];
    }
}

$(()=>{
    

});

const phone = {
    list : [],

    drawlist : ()=>{
        $list = $('#phoneList');
        $list.empty();
        $cardOrigin = $('#emptyCard').clone();
        $.each(phone.list, (i, item)=>{
            $card = $cardOrigin.clone().removeClass('d-none');
            $card.find('.idSlot').html("id : "+item.id);
            $card.find('.serialSlot').html(item.serialno);
            $card.find('.ipSlot').html(item.ip)
            $card.find('.zoneSlot').html(appendix.switch(item.zone));
            $card.find('.descSlot').html(item.desc);
            if(item.active){
                $card.find('.activeSlot').html('Active').addClass('text-success');
            }else{
                $card.find('.activeSlot').html('UnActive!').addClass('text-danger');
            }

            if(item.type != ""){
                $card.find('.typeSlot').html("/"+ appendix.switch(item.type));
            }
            // if(item.type == "quick"){
                let $wifi = $card.find('.wifiSlot');
                item.wifi == 1 ? $wifi.addClass('fa-solid fa-wifi') : $wifi.addClass('fa-duotone fa-wifi-slash');
            // }
            $card.find('.createdSlot').html(item.created_at);
            $card.find('.updatedSlot').html(item.updated_at);
            //adb버튼
            let $connect = $card.find('.connectSlot');
            if(item.connect){
                $connect.addClass('text-success');
                $card.find('.connectText').html('Connected');
            }else{
                $connect.addClass('text-danger').click(()=>{location.href='adb_connect.html'});
            }
            $card.find('.deleteButton').attr('onclick', 'apis.deletePhone("'+item.serialno+'")');
            $card.find('.editButton').attr('onclick', 'apis.openEditCard("'+item.serialno+'")');
            $list.append($card);
        });
    },
    
}

const apis = {
    getPhoneList : ()=>{
        axios.get(getHostUrl().apiServer+'/v1/device')
            .then(res=>{
                console.log(res);
                phone.list = res.data;
                phone.drawlist();
            })
            .catch(error=>{
                console.error(error);
            })
            .finally(()=>{

            });

    },
    registerPhone : ()=> {
        let formArray = $('#registerPhone').serializeArray();
        let param = {};
        formArray.map((data,i)=>{
            param[data.name] = data.value;
        });
        console.log(param);
        if(param.serialno == ''){
            alert('Serial number is Required.')
            return false;
        }
        if(param.ip == ''){
            alert('IP is Required.')
            return false;
        }
        if(param.zone == 'quick' && param.type != ''){
            alert('QUICK-SHOT cannot have Type.')
            return false;
        }
        if(param.zone == 'highlow' && param.type == ''){
            alert('FLEX-CAM type is Required.')
            return false;
        }
        axios.post(getHostUrl().apiServer+'/v1/device', param)
            .then(res=>{
                if(res.status == 200){
                    alert('Add Success.')
                    location.href='./phone_list.html';
                }else if(res.status==400 && res.data.errorCode == "3001") {                    
                    alert(res.data.message);
                    location.reload();
                }else{
                    alert("don't have Response");
                    location.reload();                    
                }
            })
            .catch(error=>{
                console.error(error);
                alert('Axios Error.'+error);
            })
            .finally(()=>{
            });

    },
    deletePhone : (serial) => {
        axios.delete(getHostUrl().apiServer+"/v1/device/"+serial)
            .then(res=>{
                if(res.status == 200 ){
                    alert('Delete Success.');
                    location.reload();
                }else{
                    alert('Delete Fail '+res.status);
                    console.log(res);
                    return false;
                }
            })
            .catch(error=>{
                console.error(error);
                alert('Axios Error.'+error);
            })
            .finally(()=>{
            });
    },
    openEditCard : (serial) => {
        $('#sendEdit').attr('onclick', "");
        $('#editSerialNo').html(serial);
        let data = phone.list.find(e=> e.serialno == serial);
        console.log(data);
        let $editForm = $('#editForm');        
        $editForm.find('[name=zone]').val(data.zone);
        $editForm.find('[name=type]').val(data.type);
        $editForm.find('[name=wifi]').val(data.wifi);
        $editForm.find('[name=active]').val(data.active);
        $editForm.find('[name=ip]').val(data.ip);
        $editForm.find('[name=desc]').val(data.desc);
        $('#sendEdit').attr('onclick', "apis.editPhone('"+serial+"')");
        $('#editCard').removeClass('d-none');
    },
    editPhone : (serial) => {
        let formArray = $('#editForm').serializeArray();
        let param = {};
        formArray.map((data,i)=>{
            param[data.name] = data.value;
        });
        console.log(param);
        if(param.serialno == ''){
            alert('Serial number is Required.')
            return false;
        }
        if(param.ip == ''){
            alert('IP is Required.')
            return false;
        }
        if(param.zone == 'quick' && param.type != ''){
            alert('QUICK-SHOT cannot have Type.')
            return false;
        }
        if(param.zone == 'highlow' && param.type == ''){
            alert('FLEX-CAM type is Required.')
            return false;
        }
        axios.post(getHostUrl().apiServer+'/v1/device/'+serial, param)
            .then(res=>{
                if(res.status == 200){
                    alert('Edit Success')
                    location.reload();
                }else if(res.status==400 && res.data.errorCode == "3001") {                    
                    alert(res.data.message);
                    location.reload();
                }else{
                    alert("don't have Response");
                    location.reload();                    
                }
            })
            .catch(error=>{
                console.error(error);
                alert('Axios Error.'+error);
            })
            .finally(()=>{
            });        
    },

    adbConnect : () => {
        let formArray = $('#adbForm').serializeArray();
        let param = {};
        formArray.map((data,i)=>{
            param[data.name] = data.value;
        });
        console.log(param);
        if(param.serialno == ''){
            alert('Serial Number is Required.')
            return false;
        }
        axios.post(getHostUrl().apiServer+'/v1/device/connect/', param)
            .then(res=>{
                if(res.status == 200){
                    alert('수정에 성공했습니다.')
                    location.reload();
                }else if(res.status==400 && res.data.errorCode == "3002") {                    
                    alert('폰 인식 없이 호출되었습니다. 폰과의 USB연결을 확인해주세요!')
                    console.log(res.data.message, res.data.stack);
                    location.reload();
                }else{
                    alert("예정된 리스폰스가 없습니다.");
                    location.reload();                    
                }
            })
            .catch(error=>{
                console.error(error);
                alert('Axios Error.'+error);
            })
            .finally(()=>{
            });           
    },

    getPhotoList : ()=>{
        let $list = $('#photoList');
        let $origin = $('#originCard');
        axios.get(getHostUrl().apiServer+"/v1/admin/images")
            .then(res=>{
                console.log(res);
                $.each(res.data, (i, item)=>{                    
                    let $card = $origin.clone().removeClass('d-none');                    
                    let src = getHostUrl().imgServer+item.filepath;
                    $card.find('img').attr('src', src);
                    $card.find('a').attr('href', src);
                    $card.find('.dtime').html(item.mtime);
                    $card.find('.printButton').attr('onclick', 'apis.sendPrint("'+item.filepath+'")');
                    $card.find('.downloadButton').attr('onclick', 'apis.downPhoto("'+item.filepath+'")');
                    $list.append($card);
                })
            })
            .catch(error=>{
                console.error(error);
                alert('통신 에러입니다.'+error);
            })
            .finally(()=>{
            });           

    },

    sendPrint : (path)=>{
        body = { image : path };
        axios.post(getHostUrl().apiServer+"/v1/admin/print", body)
        .then(res=>{
            if(res.status==200){
                alert('인쇄요청을 송신했습니다.')
            }else{
                alert('인쇄요청 송신에 실패했습니다.'+res.status);
            }
        })
        .catch(error=>{
            console.error(error);
            alert('통신 에러입니다.'+error);
        })
        .finally(()=>{
        });           
    },

    downPhoto : (path)=>{
        
        fetch(getHostUrl().imgServer+path, {
        method: "GET",
        })
        .then((res) => {
//            return res.blob();
        })
        .then((blob) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(blob);
            fileReader.onload = (data) => {
                $('#downLink').attr('href', data.target?.result).trigger('click');
            };
        })
        .catch((e) => {
            console.error(e);
        });
        
    }
    
}


utils = {
    getParamFromUrl : (key) => {
        let search = location.search.substring(1);
        let object = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
        let param = object[key];
//        object.find(e=> e.id == q)
        return param;
    },
}