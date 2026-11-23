<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<xsl:template match="/Parameters/param[@id='331273']">
		<xsl:copy-of select="."/>
		<param id="200235">
			<name>RUN ARC START MOTION IN TEST MODE</name>
			<short_name></short_name>
			<desc>A setting that tells the system to run the arc start motion in test mode.</desc>
		</param>
		<param id="264719">
			<name>HOTWIRE2 RATE</name>
			<short_name/>
			<desc>The rate at which the HOTWIRE2 parameter will be adjusted when overriding the parameter during a weld.</desc>
		</param>
		<param id="264718">
			<name>MAX HOTWIRE2</name>
			<short_name/>
			<desc>The maximum amount, expressed as a percentage, that the operator will be able to adjust the specified parameter value when overriding.</desc>
		</param>
		<param id="264715">
			<name>WIRE2 RATE</name>
			<short_name/>
			<desc>The rate at which the WIRE2 parameter will be adjusted when overriding the parameter during a weld.</desc>
		</param>
		<param id="264714">
			<name>MAX WIRE2</name>
			<short_name/>
			<desc>The maximum amount, expressed as a percentage, that the operator will be able to adjust the specified parameter value when overriding.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>