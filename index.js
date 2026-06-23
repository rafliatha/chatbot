const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const cron = require('node-cron')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)

  // Fungsi untuk mengirim pesan jadwal kerja bakti
  async function kirimJadwalKerjaBakti() {
    // Ganti dengan nomor grup/WA tujuan, contoh: '6281234567890@s.whatsapp.net' untuk personal, atau 'xxxxxx-xxxxxx@g.us' untuk grup
    const tujuan = '62895333035298@s.whatsapp.net'
    const pesan = `*Jadwal Kerja Bakti Desa Wadas*\n\nHari: Jumat\nWaktu: 07.00 WIB\nTempat: Balai Desa Wadas\n\nAyo bersama-sama menjaga kebersihan dan kekompakan desa!`
    await sock.sendMessage(tujuan, { text: pesan })
    console.log('Jadwal kerja bakti telah dikirim.')
  }

  // Jadwalkan pengiriman setiap Jumat jam 07.00 pagi
  cron.schedule('0 7 * * 5', kirimJadwalKerjaBakti)

  // Balasan otomatis jika ada yang chat "jadwal"
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    if (text && text.toLowerCase().includes('jadwal')) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Kerja bakti Desa Wadas setiap Jumat jam 07.00 WIB di Balai Desa.' })
    }
  })
}

startBot() 