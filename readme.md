# PROJECT TITLE:  ARTBOX CRUD ART EVENT APP by Vanya Markova and Subarna Paul Vignarajah

## PROJECT DESCRIPTION: 

Artbox is an application for an art gallery to connect with emerging artists who would like to hire wall spaces to exhibit their artwork. 

The artists apply to exhibit and pay for their application ‘shopping-cart’ style. The shopping cart currently has a placeholder payment form. Future work will involve linking the form to an actual payment API such as stripe and PayPal. Artists can also see their account details and edit them. They can see all approved artwork by other artists and select favourites from them. They can also view their application order history.

Admin can create, edit or delete exhibitions depending on specific criteria. They can approve or unapprove artists’ applications. They can also open, close, cancel or archive an exhibition after it is over. Admin can also view gallery statistics to inform diversity policies.

There are also future plans to develop the visitor route. Visitors will be able to view exhibitions and buy tickets to these as well as select favourite artwork to store on their profile. Currently this route exists as a placeholder.


## TECHNOLOGIES USED: 

We mainly used Express as a framework to design our application on Node.js. 

Our app consists of open routes which can be accessed by anyone, such as home, fine art, photography, plastic art and contact pages. There are also sign up and log in pages which are accessible by anyone as long as they are not signed in. Users can also search for exhibitions by week and artwork by art type.

There are three guarded routes. Visitor route can be accessed by either visitor, artist or admin; Artist routes which can be accessed by artist and admin only; Admin routes can only be accessed by admin. 

We also used cloudinary to allow the upload of images by the artists, chart.js to display gallery statistics and Nodemailer to allow the admin to email clients via the app. Nodemailer was also used to allow a password reset link to be sent to one’s email if one forgets their password.

## BIGGEST CHALLENGE:

Our biggest challenge was to create document relationships via .populate between the artists’s model and the exhibition model because we had to create an in-between artist application model which needed to be deleted on submission of the application. This was done to prevent duplication error since each application had some unique properties. The deletion of the cart meant that it was impossible to populate our exhibition model the standard way. So we used some javascript logic to manually populate our exhibition model.

## RUNNING THE PROJECT:

It is a responsive application which can run on mobile phones (particularly iPhone SE), tablets (such as iPad mini or Air), laptops and large screens. The app is supported by major browsers such as google chrome, mozilla firefox and safari. 

If one wishes to test our app, feel free to sign up as an artist, upload images of your choice and explore the different pathways within the artist route.

ARTBOX CRUD ART EVENT APP is a student's project not available for commercial use.