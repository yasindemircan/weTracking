# WeTracking-Nodejs
you can run with this code : `npm start`
## Register
#### url : /register - method: ***post***
name:string,\
surname:string,\
password:string,\
email:string \
return:`"success": true, "code": 201, message`

## Login
#### url : /login - method: ***post***
password:string,\
email:string \
return:
 ` "success": true,
  "code": 200,
  "message":-,
  "name":-,
  "token":-`

## Forget step 1
#### url : /forget - method: ***post***
email:string \
return:
   `success: true, message: Parola Sıfırlama Kodu ${email} adresine Gönderildi.`

## Forget step 2
#### url : /forget - method: ***put***
password:string,\
resetCode:string \
return:
   ` success: true, message: 'Parolanız Basarıyla Sıfırlandı.' `

## New Activity
#### url : /activity/new - method: ***post***
token:string,\
startAddress:object,\
finishAddress:object, \
waypoints:Array \
return:
   `success: true,
       message: 'Ok',
       ActivityInviteCode:'xxxxxxxxxxxx'`

## Change Activity Route
#### url : /activity - method: ***put***
token:string,\
startAddress:object,\
finishAddress:object, \
waypoints:Array \
return:
   `success: true, message: 'process successful'`

## Activity Complete
#### url : /activity/complete - method: ***post***
token:string,\
return:
   `success: true, message: 'Activity completed process successful'`

## Activity History
#### url : /activity/history - method: ***post***
token:string,\
return:
   `success: true, data:{startAddress,finishAddress,waypoints}`

## Join Activity
#### url : /connect/:roomId - method: ***get***
roomId:string,\
return:
`    
     success: true,
     roomCreator: string,
     startAddress: {},
     finishAddress: {},
     waypoints: []
`
