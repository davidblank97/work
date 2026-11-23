<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <!-- Only including english since that is all that was available when the XSL was created. Need a way to handle different languages-->
  <xsl:template match="UnitData[@localeID='en-CA']/types/*[last()]">
    <xsl:copy-of select="."/>
	<amps_rate name="AMPS RATE">
		<amps_per_ms name="AMPS PER MS">
			<conversion>1</conversion>
			<symbol>Amps/ms</symbol>
		</amps_per_ms>
	</amps_rate>
	<volts_rate name="VOLTS RATE">
		<volts_per_ms name="VOLTS PER MS">
			<conversion>1</conversion>
			<symbol>Volts/ms</symbol>
		</volts_per_ms>
	</volts_rate>
  </xsl:template>
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>