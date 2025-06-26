import multer from 'multer'
import path from 'path'
import fs from 'fs'

const createFolderIfNotExist = (folderPath) => {
    if(!fs.existsSync(folderPath)) {
        fs.mkdir(folderPath, { recursive: true })
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/menus/'
        createFolderIfNotExist(uploadPath)
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if(ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        cb(null, true)
    } else {
        cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false)
    }
}

const upload = multer({ storage, fileFilter })

export default upload