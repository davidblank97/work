<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <!-- Only including english since that is all that was available when the XSL was created. Need a way to handle different languages-->
  <xsl:template match="UnitData[@localeID='en-CA']/types/*[last()]">
    <xsl:copy-of select="."/>
		<hotwire_rate name="HOTWIRE RATE">
			<amps_per_ipm name="AMPS PER IPM">
				<conversion>1</conversion>
				<symbol>Amps/IPM</symbol>
			</amps_per_ipm>
		</hotwire_rate>
  </xsl:template>
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>