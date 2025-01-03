import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function About() {
  return (
    <div className="space-y-8 p-6">
      <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-orange-400">About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-200">
            Welcome to Srinivasa Jewellers. We offer a wide variety of high-quality gold and silver jewelry. Our shop has
            been serving the community for over 30 years.
          </p>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-orange-300">Visit our shop at:</h3>
            <p className="text-gray-300">
              Bajana Mandhir Road
              <br />
              Opposite Government Hospital
              <br />
              Bagepalli
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-500/20 bg-gray-900/60 text-white backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-orange-400">Find Our Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d968.7287125381109!2d77.79338142196417!3d13.784006417789168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb18f00240650bd%3A0x62848c289690f845!2sSRINIVASA%20JEWELLERY!5e0!3m2!1sen!2sin!4v1734758949830!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

