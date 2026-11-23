<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='DEV']/str[@id='28']">
		<str id="28">
			<text>%1 flow rate setpoint is 0 for segment %2.</text>
			<desc>Gas flow will be enabled with a flow rate of 0 which is not recommended. %1 = gas type. %2 = segment number</desc>
		</str>
	</xsl:template>
		
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>