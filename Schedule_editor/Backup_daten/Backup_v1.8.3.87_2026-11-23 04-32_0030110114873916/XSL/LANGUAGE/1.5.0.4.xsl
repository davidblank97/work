<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="language/text[@id='505']">
    <xsl:copy-of select="."/>
    <text id="506">
      <content>AVC DISABLED</content>
      <desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller does not move the AVC axis.</desc>
    </text>
    <text id="507">
      <content>SAMPLED AVC</content>
      <desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller only moves the AVC axis in either the primary or background portion of the cycle.</desc>
    </text>
    <text id="508">
      <content>CONTINUOUS AVC</content>
      <desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller moves the AVC axis in both the primary or background portions of the cycle.</desc>
    </text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>