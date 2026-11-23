<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="language/text[@id='467']">
    <xsl:copy-of select="."/>
    <text id="468">
      <content>GAS FLOW</content>
      <desc>Refers to the setpoints of gas flow rate parameters.</desc>
	  </text>
    <text id="469">
      <content>GRYPHON FORMAT</content>
      <desc>Refers to a file format supported by the previous generation welding controller called Gryphon.</desc>
    </text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>