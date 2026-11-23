<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="language[@localeID='en-CA']/text[@id='1048601']">
    <xsl:copy-of select="."/>
    <text id="1048602">
        <content>A critical software error has occurred. Please wait while a diagnostics file is created...</content>
        <desc>A message prompting the user to restart the system since a critical error has occurred.</desc>
      </text>
      <text id="1048603">
        <content>A critical software error has occurred. Please restart the system.</content>
        <desc>A message prompting the user to restart the system since a critical error has occurred.</desc>
      </text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>