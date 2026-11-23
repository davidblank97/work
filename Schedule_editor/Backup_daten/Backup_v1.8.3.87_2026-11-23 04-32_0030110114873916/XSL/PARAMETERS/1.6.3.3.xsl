<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='202702']">
		<xsl:copy-of select="."/>
	<param id="264488">
		<name>INITIAL WIRE2 SPEED</name>
		<short_name/>
		<desc>The wire feed2 speed that the wire feeder will aim to be at while starting a weld. Once a weld is started the first enabled segment's wire speed will be the new set point.</desc>
	</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>